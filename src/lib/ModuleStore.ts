import { Store } from '@sapphire/framework';
import { Module } from '../lib/Module';

type Key = keyof ModuleStoreEntries;

export class ModuleStore extends Store<Module> {
	constructor() {
		super(Module as any, { name: 'modules' });
	}
}

export interface ModuleStore {
	get<K extends Key>(key: K): ModuleStoreEntries[K];
	get(key: string): undefined;
	has(key: Key): true;
	has(key: string): false;
}

declare module '@sapphire/pieces' {
	interface Container {
		modules: ModuleStore;
	}

	interface StoreRegistryEntries {
		modules: ModuleStore;
	}
}
export interface ModuleStoreEntries {}
