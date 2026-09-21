import { MongoClient } from 'mongodb';
import { repository } from '../infrastructure/repository.mjs';
export const bad = MongoClient && repository;
