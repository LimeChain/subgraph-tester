import bigDecimal = require("js-big-decimal");

export default class BigDecimal {
    public fromString = (s: string): bigDecimal => {
        return new bigDecimal(s);
    }
    public dividedBy = (x: bigDecimal, y: bigDecimal): bigDecimal => {
        return new bigDecimal(Number(x) / Number(y));
    }
    public times = (x: bigDecimal, y: bigDecimal): bigDecimal => {
        return new bigDecimal(Number(x) * Number(y));
    }
}
