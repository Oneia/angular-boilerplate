/* tslint:disable:no-bitwise */
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { StringObject } from 'typed-object-interfaces';

export enum DebugLevel {
  Info    = 1 << 0,
  Warning = 1 << 1,
  Error   = 1 << 2,

  Main = Warning | Error,
  All  = Info | Warning | Error, // for development
  None = 0,
  Inherit = null, // Inherits from global DebugService
}

/**
 * @todo: add group, groupEnd, groupCollapsed wrappers
 *
 * @example How to use
 *
 *   class MySuperService {
 *     private debug: DebugService;
 *
 *     public firstStream$: Observable<any>;
 *
 *     public secondStream$: Observable<any>;
 *
 *     public constructor(debug: DebugService) {
 *       this.debug = debug.factory(new.target.name, DebugLevel.All);
 *
 *       this.debug.info('Default black message');
 *       this.debug.log('Light gray message with data', { prop: 'value' });
 *       this.debug.warn(
 *         'Warning orange message. %cRed label %cGreen label %cBlue label',
 *         'color: red;',
 *         'color: green;',
 *         'color: blue;',
 *       );
 *       this.debug.error('Test message Error', new Error('some error'));
 *
 *       this.debug.streams(this, [ 'firstStream$', 'secondStream$', 'unknown$' ]);
 *     }
 *   }
 *
 */
@Injectable()
export class DebugService {

  /** @see {@link calculateType} method */
  private static typeCache: StringObject = {};

  /** Stores number of every debug instance grouped by raw(not calculated) {@link type} */
  private static counters = new Map<string, number>();

  public level: DebugLevel = DebugLevel.Main;
  /** Message class. Prints in square brackets. */
  public type: string = 'Debug';
  /** Unique debug number */
  public number: number;
  /**
   * Collections(not applies to objects) will be sliced and only first n rows will be output.
   * Values from 0 to 1000
   */
  public tableOutputLimit: number = 100;

  /**
   * If instance created via {@link DebugService.factory()} method,
   * it will contains parent service
   */
  private root: DebugService;

  /** for {@link calculateType()} method */
  private calculateTypeDone: boolean = false;

  private styles = {
    type:         'color: DodgerBlue; font-weight: bold',
    typeBrackets: 'color: #000; font-weight: bold',
    message:      'color: Gray',

    normal:    'color: #000; font-weight: normal',
    important: 'color: Tomato',
    info:      'color: DodgerBlue',
    warning:   'color: Sienna',
    danger:    'color: FireBrick',
  };

  /** All subscription of the page that should be closed on destroy */
  private subs: Subscription[] = [];
  private set sub(sub: Subscription) { this.subs.push(sub); }

  public constructor(
  ) {
  }

  /**
   * Call this method in ngOnDestroy() method of your component
   */
  public destroy(): void {
    this.subs.forEach((sub: Subscription) => sub.unsubscribe());
  }

  public factory(type?: string, level?: DebugLevel): DebugService {
    console.log('debuh');
    if (this.root) {
      this.warn(`factory(): Only root DebugService can create child services`);
      return null;
    }

    let num = DebugService.counters.get(type);
    num = num === undefined ? 1 : num + 1;
    DebugService.counters.set(type, num);

    const instance = new DebugService();
    instance.type  = type || this.type;
    instance.level = level !== undefined ? level : DebugLevel.Inherit;
    instance.root  = this;
    instance.number = num;

    return instance;
  }

  public log(message: any, ...args: any[]): void {
    if (this.hasLevel(DebugLevel.Info)) {
      console.log(this.format(message), ...this.formatStyles, ...args);
    }
  }

  public info(message: any, ...args: any[]): void {
    if (this.hasLevel(DebugLevel.Info)) {
      const styles = this.formatStyles.slice(0, -1).concat(this.styles.normal);
      console.info(this.format(message), ...styles, ...args);
    }
  }

  public warn(message: any, ...args: any[]): void {
    if (this.hasLevel(DebugLevel.Warning)) {
      const styles = this.formatStyles.slice(0, -1).concat(this.styles.warning);
      console.warn(this.format(message), ...styles, ...args);
    }
  }

  public error(message: any, ...args: any[]): void {
    if (this.hasLevel(DebugLevel.Error)) {
      const styles = this.formatStyles.slice(0, -1).concat(this.styles.danger);
      console.error(this.format(message), ...styles, ...args);
    }
  }

  public assert(value: any, message: any, ...args: any[]): boolean {
    if (value) {
      return true; // The assert passed
    }
    if (this.hasLevel(DebugLevel.Warning)) {
      const styles = this.formatStyles.slice(0, -1).concat(this.styles.danger, this.styles.warning);
      console.error(this.format(`Assertion failed: %c${message}`), ...styles, ...args);
    }
    return false;
  }

  /**
   * Print a collection as a beautiful table in collapsed formatted group
   * @param message styled label. Like {@link log()}
   * @param data    an array to print as table
   * @param pick    fields of collection to printing, if you prints collection
   */
  public table(message: any[], data: any, pick?: string[]): void {
    if (!this.hasLevel(DebugLevel.Info)) {
      return;
    }

    (console.groupCollapsed as (...args) => void)(
      this.format(message[ 0 ]),
      ...this.formatStyles,
      ...message.slice(1),
    );

    const preparedData = data instanceof Array ? data.slice(0, this.tableOutputLimit) : data;
    console.table(preparedData, pick);

    console.groupEnd();
  } // end table()

  /**
   * Debug streams
   */
  public streams(object: object, streamNames: string[]): void {
    if (this.hasLevel(DebugLevel.Info)) {
      streamNames.map((stream) => this.addDebugLoggerToStream(object, stream));
    }
  }

  public hasLevel(testLevel: DebugLevel): boolean {
    const currentLevel = this.level !== null ? this.level : this.root.level;

    return !!(currentLevel & testLevel);
  }

  /**
   * @see {@link formatStyles} for understand string styles
   */
  private format(text: string): string {
    this.calculateType();
    return `%c[%c${this.type}%c:${this.number}%c]%c: %c${text}`;
  }

  private calculateType(): void {
    if (this.calculateTypeDone) {
      return;
    }
    this.calculateTypeDone = true;

    if (!DebugService.typeCache[ this.type ]) {
      // Splitting. MySuperComponent => MySuper.Component
      DebugService.typeCache[ this.type ] = this.type.replace(
        /^(.+?)(Service|Component|Pipe|Directive)$/,
        '$1.$2',
      );
    }

    this.type = DebugService.typeCache[ this.type ];
  }

  /**
   * @see {@link DebugService.format}
   */
  private get formatStyles(): string[] {
    return [
      this.styles.typeBrackets,
      this.styles.type,
      this.styles.message,
      this.styles.typeBrackets,
      this.styles.normal,
      this.styles.message,
    ];
  }

  private addDebugLoggerToStream(object: object, stream: string): void {
    const baseStyles    = [ ...this.formatStyles, this.styles.important, this.styles.message ];
    const infoStyles    = [ ...baseStyles, this.styles.info,    this.styles.message ];
    const warningStyles = [ ...baseStyles, this.styles.warning, this.styles.message ];

    if (object[stream] instanceof Observable === false) {
      console.warn(
        this.format(`(Stream:%c${stream}%c): %cnon-existent stream%c`),
        ...warningStyles,
      );

      return null;
    }

    this.sub = object[ stream ].subscribe(
      (data) =>
        console.log(this.format(`(Stream:%c${stream}%c): %cNext%c:`), ...infoStyles, data),

      (data) =>
        console.log(this.format(`(Stream:%c${stream}%c): %cError%c:`), ...warningStyles, data),

      () => console.log(this.format(`(Stream:%c${stream}%c): %cComplete%c`), ...infoStyles),
    );
  } // end addDebugLoggerToStream()

}
