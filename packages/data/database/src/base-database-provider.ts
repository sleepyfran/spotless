import { Single, singleFrom } from "@spotless/services-rx";
import { Id } from "@spotless/types";
import { String } from "@spotless/services-utils";
import { Database } from "./database";
import { fieldNameOf } from "./utils";
import { Collection, IndexableType, Table } from "dexie";

export type OrderBy<T> = {
  /**
   * The key to use to order the records.
   */
  key: keyof T;

  /**
   * The direction to use to order the records. If left undefined, then it will
   * default to asc.
   */
  direction?: "asc" | "desc";
};

/**
 * Defines the options that can be passed to the fetch methods.
 */
export type FetchOptions<T> = {
  /**
   * The maximum number of records to return. If left undefined, all the records
   * will be returned.
   */
  limit?: number;

  /**
   * The key to use to order the records. If left undefined, the default ordering
   * key will be used.
   */
  orderBy?: OrderBy<T> | keyof T;
};

/**
 * Returns the keys of T that are strings.
 */
type StringKeyOf<T> = {
  [K in keyof T]: T[K] extends string ? K : never;
}[keyof T];

export type FilterOptions<T> = {
  /**
   * Filter to apply to the records.
   */
  filter: string;

  /**
   * The field to use to filter the records.
   */
  filterField: StringKeyOf<T> | StringKeyOf<T>[];
} & FetchOptions<T>;

/**
 * Base class for providers that gather data from the database. Exposes a set of
 * methods that implement the most common queries.
 */
export class DataProvider<T> {
  constructor(
    protected readonly db: Database,
    protected readonly table: Table<T, IndexableType>,
    protected readonly defaultOrderingKey: keyof T
  ) {}

  /**
   * Returns the record with the given id, if any.
   */
  public byId(id: Id): Single<T | undefined> {
    return singleFrom(this.table.where("id").equals(id).first());
  }

  /**
   * Returns all the records in the database, optionally limited by the given
   * options or ordered by a given key.
   */
  public fetch(opts?: FetchOptions<T>): Single<T[]> {
    return singleFrom(
      this.db.observe(() => {
        return this.createQuery(opts).toArray();
      })
    );
  }

  /**
   * Returns all the records in the database, optionally limited by the given
   * options or ordered by a given key. The records will be filtered to match
   * the specified filter, applied over the specified field.
   */
  public filtered(opts: FilterOptions<T>): Single<T[]> {
    const normalizedFilter = String.normalizeForComparison(opts.filter);

    return this.db.observe(() => {
      const query = this.createQuery(opts);

      return query
        .filter((field) => {
          return this.fieldValues(field, opts).some((value) =>
            value.includes(normalizedFilter)
          );
        })
        .toArray();
    });
  }

  private createQuery = (
    opts?: FetchOptions<T>
  ): Collection<T, IndexableType> => {
    let query = this.table.orderBy(this.orderingKey(opts));
    query = this.orderingDirection(opts) === "desc" ? query.reverse() : query;
    query = opts?.limit ? query.limit(opts.limit) : query;
    return query;
  };

  private orderingKey = (opts?: FetchOptions<T>): string => {
    const key =
      typeof opts?.orderBy === "object" ? opts.orderBy.key : opts?.orderBy;

    return fieldNameOf<T>(key || this.defaultOrderingKey) as string;
  };

  private orderingDirection = (opts?: FetchOptions<T>): "asc" | "desc" => {
    const direction =
      typeof opts?.orderBy === "object" ? opts.orderBy.direction : undefined;
    return direction || "asc";
  };

  private fieldValues = (field: T, opts: FilterOptions<T>): string[] => {
    const keys = Array.isArray(opts.filterField)
      ? opts.filterField
      : [opts.filterField];

    return keys.map((key) => {
      return String.normalizeForComparison(field[key] as string);
    });
  };
}
