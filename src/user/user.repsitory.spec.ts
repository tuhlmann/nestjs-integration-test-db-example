import { Connection, Repository } from "typeorm"

import { TestUtils } from "../test/test.utils"
import { Test, TestingModule } from "@nestjs/testing"

import * as Fs from "fs"
import * as Path from "path"
import { TypeOrmModule, getRepositoryToken, getCustomRepositoryToken } from "@nestjs/typeorm"
import { DatabaseService } from "../database/database.service"
import { DatabaseModule } from "../database/database.module"
import { UserRepository } from "./user.repository"
import { User } from "./user.entity"
import { Teacher } from "./teacher.entity"
import { TeacherUser } from "./teacher-user.entity"

describe("UserRepository", () => {
  let module: TestingModule
  let userRepository: UserRepository
  let testUtils: TestUtils

  beforeEach(async done => {
    // E1) This also works
    // module = await Test.createTestingModule({
    //   imports: [
    //     TypeOrmModule.forRoot({
    //       type: "sqlite",
    //       database: "./db/test-db.sql",
    //       entities: [User, Teacher, TeacherUser],
    //       synchronize: true,
    //       dropSchema: true
    //     }),
    //     TypeOrmModule.forFeature([UserRepository])
    //   ],
    //   providers: []
    // }).compile()

    // E2
    module = await Test.createTestingModule({
      imports: [DatabaseModule, TypeOrmModule.forFeature([UserRepository])],
      providers: [DatabaseService, TestUtils]
    }).compile()

    // testUtils = module.get<TestUtils>(TestUtils)
    // await testUtils.reloadFixtures()

    // This seems to work
    userRepository = module.get<UserRepository>(getRepositoryToken(User))

    // This works as well
    // userRepository = module.get<UserRepository>(UserRepository)
    done()
  })

  afterEach(async done => {
    // await testUtils.closeDbConnection()
    module.close()
    done()
  })

  describe("findAll", () => {
    it("should return all users", async done => {
      // creating a user works, and its then found in the db
      const user = new User()
      user.name = "Peter"
      user.description = "A cool lad"
      const userResult = await user.save()

      console.log("created user: ", user)

      expect(userResult.name).toEqual("Peter")

      // fetching data through UserRepository does not work
      const [data, total] = await userRepository.findAll()
      expect(total).toBe(1)
      expect(data.length).toEqual(1)
      expect(data[0].name).toBe("Peter")
      done()
    })
  })
})
