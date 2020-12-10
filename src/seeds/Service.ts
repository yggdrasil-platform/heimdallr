import { Connection } from 'typeorm';

// Models.
import { Service } from '../models';

const data: Partial<Service>[] = [
  {
    createdAt: new Date(),
    name: 'valkyrie',
    updatedAt: new Date(),
    url: 'http://valkyrie:3000',
  },
];

export async function run(connection: Connection): Promise<void> {
  const services: Service[] = await connection
    .getRepository(Service)
    .createQueryBuilder('service')
    .getMany();

  // Update and existing data.
  for (const service of data) {
    if (services.find((value) => value.name === service.name)) {
      await connection
        .createQueryBuilder()
        .update(Service)
        .set(service)
        .where('name = :name', {
          name: service.name,
        })
        .execute();
    }
  }

  // Finally, insert any new data.
  await connection
    .createQueryBuilder()
    .insert()
    .into(Service)
    .values(
      data.reduce<Partial<Service>[]>((acc, currentValue) => {
        if (!services.find((value) => value.name === currentValue.name)) {
          return [...acc, currentValue];
        }

        return acc;
      }, [])
    )
    .execute();
}
