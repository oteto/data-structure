type Matcher<V> = {
  match: <T>(opt: { some: (v: V) => T; none: () => T }) => T;
};

type None = _None;
type Some<V> = _Some<V>;
export type Option<V> = Some<V> | None;

class _Some<V> implements Matcher<V> {
  value: V;
  constructor(value: V) {
    this.value = value;
  }
  match<T>({ some }: { some: (v: V) => T }): T {
    return some(this.value);
  }
}

class _None implements Matcher<unknown> {
  match<T>({ none }: { none: () => T }): T {
    return none();
  }
}

const none = Object.freeze(new _None());

export const Some = <V>(value: V): Option<V> => new _Some(value);
export const None = <V>(): Option<V> => none;

export const someIf = <V>(
  option: Option<V>,
  fn: (value: V) => void,
  orElse?: () => void,
): void => {
  option.match({ some: (v) => fn(v), none: () => orElse?.() });
};
