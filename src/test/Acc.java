package test;

import java.util.Comparator;
import java.util.Iterator;
import java.util.function.BiFunction;
import java.util.function.BinaryOperator;
import java.util.function.Function;

public class Acc<N> {
    private final N starter;
    private final BinaryOperator<N> op;

    public Acc(BinaryOperator<N> op) {
        this(null, op);
    }

    public Acc(N starter, BinaryOperator<N> op) {
        this.starter = starter;
        this.op = (n1, n2) -> n1 == null ? n2 : op.apply(n1, n2);
    }

    public static <N> BinaryOperator<N> max(Comparator<N> comparator) {
        return (n1, n2) -> comparator.compare(n1, n2) > 0 ? n1 : n2;
    }

    public static <N> BinaryOperator<N> min(Comparator<N> comparator) {
        return (n1, n2) -> comparator.compare(n1, n2) < 0 ? n1 : n2;
    }

    public N of(Iterable<N> iterable) {
        N res = starter;
        for (N value : iterable) {
            res = op.apply(res, value);
        }
        return res;
    }

    public <T> N of(Iterable<T> iterable, Function<T, N> mapper) {
        N res = starter;
        for (T t : iterable) {
            res = op.apply(res, mapper.apply(t));
        }
        return res;
    }

    public <T> N ofLink(Iterable<T> iterable, BiFunction<T, T, N> mapper) {
        N res = starter;
        T last = null;
        for (T t : iterable) {
            if (last != null) {
                res = op.apply(res, mapper.apply(last, t));
            }
            last = t;
        }
        return res;
    }

    public <T> N ofPair(Iterable<T> iterable, BiFunction<T, T, N> mapper) {
        N res = starter;
        int i = 0;
        for (T t : iterable) {
            if (i > 0) {
                Iterator<T> iterator = iterable.iterator();
                for (int j = 0; j < i && iterator.hasNext(); j++) {
                    res = op.apply(res, mapper.apply(iterator.next(), t));
                }
            }
            i++;
        }
        return res;
    }
}
