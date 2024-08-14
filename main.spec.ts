import validate from "./main"
import { describe, test } from "@jest/globals"
describe('Validate String', () => {
    describe('Logic cases', () => {
        test('should return false if is null or undefined', () => {
            const mock_data = null || undefined;
            console.log(`Sample Data: ${mock_data}`);
            const result = validate.text(mock_data);
            expect(result).toBe(false);
        });
        test('should return true if string', () => {
            const mock_data = 'twenty-three';
            console.log(`Sample Data: ${mock_data}`);
            const result = validate.text(mock_data);
            expect(result).toBe(true);
        });
        test('should return false if not string', () => {
            const mock_data = 23;
            console.log(`Sample Data: ${mock_data}`);
            const result = validate.text(mock_data);
            expect(result).toBe(false);
        });
    });
});

describe('Validate Object', () => {
    describe('Logic cases', () => {
        test('should return true if string', () => {
            const mock_data = {
                name: 'John Doe',
                age: 21
            };
            console.log(`Sample Data: ${mock_data}`);
            const result = validate.object(mock_data);
            expect(result).toBe(true);
        });
        test('should return false if not string', () => {
            const mock_data = 23;
            console.log(`Sample Data: ${mock_data}`);
            const result = validate.object(mock_data);
            expect(result).toBe(false);
        });
    });
});