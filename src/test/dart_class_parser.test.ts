import { add } from '../dart_class_parser';

describe('testing index file', () => {
    test('empty string should result in zero', () => {
        expect(add()).toBe(2);
    });
});