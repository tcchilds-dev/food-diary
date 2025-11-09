import { prisma } from "../src/client";
import { faker } from "@faker-js/faker";

async function main() {
  // Generate 50 food entries
  for (let i = 0; i < 50; i++) {
    await prisma.entry.create({
      data: {
        userId: 1,
        entryType: "food",

        mealType: "test",
        foodName: faker.food.dish(),
        calories: faker.number.int({ min: 100, max: 2000 }),

        symptomType: null,
        symptomSeverity: null,

        exerciseType: null,
        exerciseIntensity: null,
        exerciseDuration: null,

        notes: faker.lorem.paragraph(1),
      },
    });
  }
  // Generate 20 symptom entries
  for (let i = 0; i < 20; i++) {
    await prisma.entry.create({
      data: {
        userId: 1,
        entryType: "symptom",

        mealType: null,
        foodName: null,
        calories: null,

        symptomType: faker.word.noun(),
        symptomSeverity: faker.number.int({ min: 1, max: 5 }),

        exerciseType: null,
        exerciseIntensity: null,
        exerciseDuration: null,

        notes: faker.lorem.paragraph(1),
      },
    });
  }
  // Generate 20 exercise entries
  for (let i = 0; i < 20; i++) {
    await prisma.entry.create({
      data: {
        userId: 1,
        entryType: "exercise",

        mealType: null,
        foodName: null,
        calories: null,

        symptomType: null,
        symptomSeverity: null,

        exerciseType: faker.word.verb(),
        exerciseIntensity: faker.number.int({ min: 1, max: 5 }),
        exerciseDuration: faker.number.int({ min: 30, max: 120 }),

        notes: faker.lorem.paragraph(1),
      },
    });
  }

  console.log("Seeded entries");
}

main()
  .catch((e) => console.error(e))
  .finally(() => prisma.$disconnect);
