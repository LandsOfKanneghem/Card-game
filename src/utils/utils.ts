export function isNonNegativeIntegerNumber(value: number): boolean {
    return  typeof value === 'number' && 
            Number.isInteger(value) && 
            value >= 0;
}

//возвращает случайное число
export function getRandomValue(min: number, max: number): number {
    const randomBuffer = new Uint32Array(1);
    window.crypto.getRandomValues(randomBuffer);
    const randomNumber = randomBuffer[0] / (0xffffffff + 1);
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(randomNumber * (max - min + 1)) + min;
}

//возвращает UID
export function getUID(): string {
    return (~~(Math.random()*1e8)).toString(16)
}

//перемешать элементы массива
export function shuffleArr<T>(arr: T[]): void {
    for (let i = arr.length - 1; i > 0; i--) {
        let j = getRandomValue(0, i);
        [arr[i], arr[j]] = [arr[j], arr[i]]
    }
}