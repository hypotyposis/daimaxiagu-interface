export interface IBlockField {
  name?: string;
  variabletype?: string;
  value?: string;
}

export interface IBlockArguments {
  type: string;
  field: IBlockField;
  error: (message: string) => void;
  statement: (name: string) => string;
  value: (name: string) => string;
}

export type BlockCodeGenerator<T extends IBlockArguments = IBlockArguments> = (
  props: T,
) => string | (string | undefined)[];
