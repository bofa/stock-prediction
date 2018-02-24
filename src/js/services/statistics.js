import { Iterable } from 'immutable';

export function average(list) {
  const length = Iterable.isIterable(list) ? list.size : list.length;

  return list.reduce((out, sum) => out + sum, 0) / length;
}
