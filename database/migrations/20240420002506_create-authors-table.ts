import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
	return knex.schema.createTable('authors', (table) => {
		table.uuid('id').primary().defaultTo(knex.fn.uuid());
		table.text('name').notNullable();
		table.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
		table.timestamp('updated_at').notNullable().defaultTo(knex.fn.now());
		table.timestamp('deleted_at').defaultTo(null);
	});
}

export async function down(knex: Knex): Promise<void> {
	return knex.schema.dropTable('authors');
}
