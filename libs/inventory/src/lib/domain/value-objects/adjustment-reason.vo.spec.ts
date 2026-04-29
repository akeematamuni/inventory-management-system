import { AdjustmentReason, AdjustmentReasonCode } from './adjustment-reason.vo';

describe('AdjustmentReason Value Object', () => {
    describe('Creation', () => {
        const reasonNull = AdjustmentReason.create({ code: AdjustmentReasonCode.THEFT });
        const reasonValid = AdjustmentReason.create({ code: AdjustmentReasonCode.DAMAGE, notes: 'Broken pallet' });
        const reasonSpaces = AdjustmentReason.create({ code: AdjustmentReasonCode.EXPIRY, notes: ' Expired yesterday '});

        it('should allow null or empty notes for standard reason codes', () => {
            expect(reasonNull.notes).toBeNull();
        });

        it('should create an adjustment reason with valid code and notes', () => {
            expect(reasonValid.code).toBe(AdjustmentReasonCode.DAMAGE);
            expect(reasonValid.notes).toBe('Broken pallet');
        });

        it('should trim notes during creation', () => {
            expect(reasonSpaces.notes).toBe('Expired yesterday');
        });

        it('should throw an error if code is OTHER and notes are missing', () => {
            expect(() => AdjustmentReason.create({ code: AdjustmentReasonCode.OTHER })).toThrow();
        });

        it('should throw an error if code is OTHER and notes are only whitespace', () => {
            expect(() => AdjustmentReason.create({ code: AdjustmentReasonCode.OTHER, notes: '  ' })).toThrow();
        });
    });

    describe('Equality', () => {
        const r1 = AdjustmentReason.create({ code: AdjustmentReasonCode.DAMAGE, notes: 'Fix' });
        const r2 = AdjustmentReason.create({ code: AdjustmentReasonCode.DAMAGE, notes: 'Fix' });
        const r3 = AdjustmentReason.create({ code: AdjustmentReasonCode.DAMAGE, notes: 'Fix A' });

        it('should be equal if code and notes are identical', () => {
            expect(r1.equals(r2)).toBe(true);
        });

        it('should not be equal if notes differ', () => {
            expect(r1.equals(r3)).toBe(false);
        });
    });
});
