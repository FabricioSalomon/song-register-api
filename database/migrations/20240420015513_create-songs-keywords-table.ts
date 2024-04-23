import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
	return knex.schema.createTable('songs-keywords', (table) => {
		table.uuid('id').primary().defaultTo(knex.fn.uuid());
		table.uuid('song_id').references('id').inTable('songs').onUpdate('CASCADE').onDelete('CASCADE');
		table.uuid('keyword_id').references('id').inTable('keywords').onUpdate('CASCADE').onDelete('CASCADE');
		table.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
		table.timestamp('updated_at').notNullable().defaultTo(knex.fn.now());
		table.timestamp('deleted_at').defaultTo(null);
	});
}

export async function down(knex: Knex): Promise<void> {
	return knex.schema.dropTable('songs-keywords');
}
