import { AppDataSource } from '../data-source';
import { Message } from '../entity/Message';
import { FindManyOptions, Repository } from 'typeorm';

export class MessageService {
    private messageRepository: Repository<Message>;

    constructor() {
        this.messageRepository = AppDataSource.getRepository(Message);
    }

    async create(messageData: Partial<Message>): Promise<Message> {
        const message = this.messageRepository.create(messageData);
        return await this.messageRepository.save(message);
    }

    async findAll(params?:FindManyOptions<Message>): Promise<Message[]> {
        return await this.messageRepository.find(params);
    }

    async findById(id: string): Promise<Message | null> {
        return await this.messageRepository.findOne({ where: { id } });
    }

    async update(id: string, messageData: Partial<Message>): Promise<Message | null> {
        await this.messageRepository.update(id, messageData);
        return this.findById(id);
    }

    async delete(id: string): Promise<void> {
        await this.messageRepository.delete(id);
    }
}
