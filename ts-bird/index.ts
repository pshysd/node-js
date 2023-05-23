let a: boolean = true;

const b: { hello: string } = { hello: 'world' };

function add(x: number, y: number): number {
	return x + y;
}

const minus = (x: number, y: number): number => x - y;

// typeAlias
type Func = (x: number) => string;

const func: Func/* (x: number) => string */ = (x: number) => x.toString();