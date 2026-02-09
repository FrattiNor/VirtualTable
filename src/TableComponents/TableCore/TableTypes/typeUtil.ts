// 取对象对应value的key
export type ValueTypeKeys<T, Type> = { [K in keyof T]: T[K] extends Type ? K : never }[keyof T];

// 将所有value置为undefined
export type Partial2Undefined<T> = {
	[P in keyof T]?: undefined;
};
