package test;

import java.util.function.IntBinaryOperator;

public class IntAcc {
    private final int starter;
    private final IntBinaryOperator op;

    public IntAcc(IntBinaryOperator op) {
        this(0, op);
    }

    public IntAcc(int starter, IntBinaryOperator op) {
        this.starter = starter;
        this.op = op;
    }

    public int of(Iterable<Integer> iterable) {
        int res = starter;
        for (Integer value : iterable) {
            res = op.applyAsInt(res, value);
        }
        return res;
    }
}
