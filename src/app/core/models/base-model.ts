/* tslint:disable:max-classes-per-file */
import { AnyObject } from 'typed-object-interfaces';

/**
 * This is helper class for parse server response
 */
export class To {

  public static number(raw: any): number {
    const n = Number(raw);
    return raw === undefined || raw === null || isNaN(n) ? null : n;
  }

  public static boolean(raw: any): boolean {
    return raw === undefined || raw === null ? null : Boolean(Number(raw));
  }

  public static string(raw: any): string {
    return raw === undefined || raw === null ? null : String(raw);
  }

  public static object(raw: any): object {
    return raw === undefined || raw === null || raw instanceof Object === false ? null : raw;
  }

  public static array<T extends any>(raw: any): T[] {
    return raw === undefined || raw === null || raw instanceof Array === false ? null : raw;
  }

  public static empty<T, R>(raw: R, cb?: (raw: R) => T): T | R {
    return raw === undefined || raw === null ? null : (cb instanceof Function ? cb(raw) : raw);
  }

}

export abstract class BaseModel<M> {

  /**
   * Clone model object and apply patch if it need
   */
  public clone(patch: Partial<M> = {}): M {
    const Constructor: { new(M): M } = this.constructor as any;

    const clone: M = new Constructor(this);

    Object.assign(clone, patch);

    return clone;
  } // end clone()

  /**
   * Take 'field' from 'raw' object and if in not equal to 'undefined' set it to 'this' object
   */
  protected fill<T extends keyof M>(
    raw: any,
    field: T,
    rawField?: string,
  ): void {
    const model: AnyObject = this;
    const sourceField = rawField !== undefined ? rawField : field;

    model[ field ] = raw[ sourceField ] === undefined
      ? ( // ability to use default values
        model[ sourceField ] !== undefined ? model[ sourceField ] : null
      )
      : ( // make copy of the object if it an array or a BaseModel instance
        raw[ sourceField ] instanceof Array     ? (raw[ sourceField ] as any[]).concat()    :
          raw[ sourceField ] instanceof BaseModel ? (raw[ sourceField ] as BaseModel<any>).clone() :
            raw[ sourceField ]
      );
  }

  /**
   * Calls {@link BaseModel.fill()} to an array of fields
   */
  protected fillAll(data: AnyObject, fields: Array<keyof M>): void {
    fields.forEach((field) => this.fill(data, field));
  }

} // end BaseModel
