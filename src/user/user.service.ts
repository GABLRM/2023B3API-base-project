import { HttpException, HttpStatus, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, UserRole } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) { }

  async findOneByEmail(email: string): Promise<User | undefined> {
    return await this.usersRepository.findOne({ where: { email: email } });
  }

  async findAuth(email: string): Promise<User | undefined> {
    return await this.usersRepository.findOne({ where: { email: email }, select: { id: true, username: true, email: true, password: true, role: true } });
  }

  async create(createUserDto: CreateUserDto) {
    const saltOrRounds = 10;
    const newUser = this.usersRepository.create({
      ...createUserDto,
      role: createUserDto.role ?? UserRole.EMPLOYEE,
      password: await bcrypt.hash(createUserDto.password, saltOrRounds),
    });
    const addNewUser = await this.usersRepository.save(newUser);
    delete addNewUser.password
    return addNewUser
  }

  async findEmployee(uuid: string) {
    const findEmployee = await this.usersRepository.findOne({where: {id: uuid}});
    if (findEmployee === null) {
      throw new NotFoundException("employee not found");
    }
    return findEmployee;
  }

  findAll() {
    return this.usersRepository.find();
  }

  findOne(id: string) {
    return this.usersRepository.findOne( { where: { id: id } });
  }

  remove(id: number) {
    return this.usersRepository.delete(id);
  }
}
