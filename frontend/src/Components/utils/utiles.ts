interface PSDPoint {
    x: number;
    y: number;
}

export const computeChunkAveragedPSD = (
    data: number[][],
    startFrequency: number,
    endFrequency: number,
): PSDPoint[] => {
    const flattened = data.flat()
    const chunkSize = (endFrequency - startFrequency) / flattened.length;
    console.log('Chunk size:', chunkSize);
    // const frequencyStep = (endFrequency - startFrequency) / totalChunks;
    
    const averagedPsd: PSDPoint[] = [];

    // for (let i = 0; i < flattened.length; i += chunkSize) {
    //     const chunk = flattened.slice(i, i + chunkSize);
    //     const avg = chunk.reduce((sum, val) => sum + val, 0) / chunk.length;

    //     averagedPsd.push({
    //         x: startFrequency + (i / chunkSize) * frequencyStep,
    //         y: avg,
    //     });
    // }

    return averagedPsd;
};
