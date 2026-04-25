export async function executeTransaction() {
  const { default: db } = await import('@adonisjs/lucid/services/db');
  const original = db.transaction.bind(db);
  db.transaction = (async (cb: any) => cb(makeMockTrx())) as unknown as typeof db.transaction;
  return () => (db.transaction = original);
}

export function makeMockTrx(): any {
  const builder: any = {
    where: () => builder,
    whereNot: () => builder,
    whereNotIn: () => builder,
    delete: async () => {},
    first: async () => null,
  };
  return {
    from: () => builder,
    rawQuery: async () => ({ rows: [] }),
  };
}

export function mockQueryBuilder(result: unknown): any {
  const builder: any = {
    where: () => builder,
    whereNot: () => builder,
    first: async () => result,
  };
  return builder;
}
