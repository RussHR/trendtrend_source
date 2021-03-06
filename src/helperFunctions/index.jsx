export function getPeaksFromBuffer(buffer, resolve) {
    runBufferThroughLowpass(buffer, resolve);
}

function runBufferThroughLowpass(buffer, resolve) {
    const OfflineAudioContextClass = (window.OfflineAudioContext || window.webkitOfflineAudioContext || window.mozOfflineAudioContext);
    const offlineContext = new OfflineAudioContextClass(1, buffer.length, buffer.sampleRate);
    const source = offlineContext.createBufferSource();
    source.buffer = buffer;
    const filter = offlineContext.createBiquadFilter();
    filter.type = "lowpass";
    source.connect(filter);
    filter.connect(offlineContext.destination);
    source.start(0);
    offlineContext.startRendering();
    offlineContext.oncomplete = (e) => {
        processLowpassedBuffer(e.renderedBuffer, buffer, resolve);
    };
}

function processLowpassedBuffer(renderedBuffer, originalBuffer, resolve) {
    const float32Array = renderedBuffer.getChannelData(0);
    const maxValue = getFloat32ArrayMax(float32Array);
    const minValue = getFloat32ArrayMin(float32Array);
    const float32Threshold = minValue + ((maxValue - minValue) * 0.98);
    const uInt8Threshold = (((float32Threshold - minValue) * 255) / (maxValue - minValue));
    resolve({ audioBuffer: originalBuffer, threshold: uInt8Threshold });
}

function getFloat32ArrayMax(float32Array) {
    let maxValue = -Infinity;
    const arrLength = float32Array.length;

    for (let i = 0; i < arrLength; i++) {
        const currentValue = float32Array[i];
        if (maxValue < currentValue) maxValue = currentValue;
    }
    return maxValue;
 }

 function getFloat32ArrayMin(float32Array) {
    let minValue = Infinity;
    const arrLength = float32Array.length;

    for (let i = 0; i < arrLength; i++) {
        const currentValue = float32Array[i];
        if (minValue > currentValue) minValue = currentValue;
    }
    return minValue;
 }