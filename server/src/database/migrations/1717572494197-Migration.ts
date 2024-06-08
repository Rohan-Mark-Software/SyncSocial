import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1717572494197 implements MigrationInterface {
    name = 'Migration1717572494197'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "message" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "content" character varying(2000) NOT NULL DEFAULT 'No content', "created_at" TIMESTAMP NOT NULL DEFAULT now(), "userId" uuid, "planId" uuid, CONSTRAINT "PK_ba01f0a3e0123651915008bc578" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "detail" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "mood" character varying(50) NOT NULL DEFAULT 'No content', "budget" integer NOT NULL, "date" character varying(200) NOT NULL, "userId" uuid, "planId" uuid, CONSTRAINT "PK_28de27ee9ae6103af88ab1b3c0c" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "plan" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying(50) NOT NULL, "code" character varying(10) NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_e405cbb23fb08931a48ad8c2bdb" UNIQUE ("code"), CONSTRAINT "PK_54a2b686aed3b637654bf7ddbb3" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "unsent-message" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "messageId" uuid, CONSTRAINT "REL_96358070c21bf85a0b8ee42ce0" UNIQUE ("messageId"), CONSTRAINT "PK_cba41f322930c75ff8836aa614b" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "user" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "username" character varying(50) NOT NULL DEFAULT 'NoName', "verificationMethod" "public"."user_verificationmethod_enum" NOT NULL DEFAULT 'LOCAL', "verificationValue" character varying NOT NULL, "email" character varying, "password" character varying, "accessTokenVersion" smallint NOT NULL DEFAULT '0', "refreshTokenVersion" smallint NOT NULL DEFAULT '0', "emailConfirmed" boolean NOT NULL DEFAULT false, "emailVerificationToken" character varying, "passwordResetToken" character varying, "role" "public"."user_role" NOT NULL DEFAULT 'USER', "created_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"), CONSTRAINT "UQ_356d0fa99ca88f930430cfce5ad" UNIQUE ("verificationMethod", "verificationValue"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "user_plans_plan" ("userId" uuid NOT NULL, "planId" uuid NOT NULL, CONSTRAINT "PK_a6f31be3c199c71cdd8da560970" PRIMARY KEY ("userId", "planId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_34cca65608052ed88abaad3439" ON "user_plans_plan" ("userId") `);
        await queryRunner.query(`CREATE INDEX "IDX_ef97615f822b58a320964369dd" ON "user_plans_plan" ("planId") `);
        await queryRunner.query(`CREATE TABLE "user_unsent_messages_unsent-message" ("userId" uuid NOT NULL, "unsentMessageId" uuid NOT NULL, CONSTRAINT "PK_939cd3d3a23e81aef847ab29d8f" PRIMARY KEY ("userId", "unsentMessageId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_8c2d516ad45f804a9419787987" ON "user_unsent_messages_unsent-message" ("userId") `);
        await queryRunner.query(`CREATE INDEX "IDX_19e0875922359755b66a24d0cd" ON "user_unsent_messages_unsent-message" ("unsentMessageId") `);
        await queryRunner.query(`ALTER TABLE "message" ADD CONSTRAINT "FK_446251f8ceb2132af01b68eb593" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "message" ADD CONSTRAINT "FK_f6959364f94fc11ca9d2a7ecd1a" FOREIGN KEY ("planId") REFERENCES "plan"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "detail" ADD CONSTRAINT "FK_e83149aca9ac7b7eedbad3ac43d" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "detail" ADD CONSTRAINT "FK_8ba4fe1b0857f655dfd87e6a68c" FOREIGN KEY ("planId") REFERENCES "plan"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "unsent-message" ADD CONSTRAINT "FK_96358070c21bf85a0b8ee42ce01" FOREIGN KEY ("messageId") REFERENCES "message"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user_plans_plan" ADD CONSTRAINT "FK_34cca65608052ed88abaad3439f" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "user_plans_plan" ADD CONSTRAINT "FK_ef97615f822b58a320964369dd0" FOREIGN KEY ("planId") REFERENCES "plan"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "user_unsent_messages_unsent-message" ADD CONSTRAINT "FK_8c2d516ad45f804a9419787987a" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "user_unsent_messages_unsent-message" ADD CONSTRAINT "FK_19e0875922359755b66a24d0cd1" FOREIGN KEY ("unsentMessageId") REFERENCES "unsent-message"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_unsent_messages_unsent-message" DROP CONSTRAINT "FK_19e0875922359755b66a24d0cd1"`);
        await queryRunner.query(`ALTER TABLE "user_unsent_messages_unsent-message" DROP CONSTRAINT "FK_8c2d516ad45f804a9419787987a"`);
        await queryRunner.query(`ALTER TABLE "user_plans_plan" DROP CONSTRAINT "FK_ef97615f822b58a320964369dd0"`);
        await queryRunner.query(`ALTER TABLE "user_plans_plan" DROP CONSTRAINT "FK_34cca65608052ed88abaad3439f"`);
        await queryRunner.query(`ALTER TABLE "unsent-message" DROP CONSTRAINT "FK_96358070c21bf85a0b8ee42ce01"`);
        await queryRunner.query(`ALTER TABLE "detail" DROP CONSTRAINT "FK_8ba4fe1b0857f655dfd87e6a68c"`);
        await queryRunner.query(`ALTER TABLE "detail" DROP CONSTRAINT "FK_e83149aca9ac7b7eedbad3ac43d"`);
        await queryRunner.query(`ALTER TABLE "message" DROP CONSTRAINT "FK_f6959364f94fc11ca9d2a7ecd1a"`);
        await queryRunner.query(`ALTER TABLE "message" DROP CONSTRAINT "FK_446251f8ceb2132af01b68eb593"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_19e0875922359755b66a24d0cd"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_8c2d516ad45f804a9419787987"`);
        await queryRunner.query(`DROP TABLE "user_unsent_messages_unsent-message"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_ef97615f822b58a320964369dd"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_34cca65608052ed88abaad3439"`);
        await queryRunner.query(`DROP TABLE "user_plans_plan"`);
        await queryRunner.query(`DROP TABLE "user"`);
        await queryRunner.query(`DROP TABLE "unsent-message"`);
        await queryRunner.query(`DROP TABLE "plan"`);
        await queryRunner.query(`DROP TABLE "detail"`);
        await queryRunner.query(`DROP TABLE "message"`);
    }

}
