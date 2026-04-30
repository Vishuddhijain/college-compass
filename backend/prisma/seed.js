"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
async function main() {
    await prisma.savedCollege.deleteMany();
    await prisma.college.deleteMany();
    await prisma.user.deleteMany();
    await prisma.college.createMany({
        data: [
            {
                name: "IIT Delhi",
                location: "Delhi",
                fees: 220000,
                rating: 4.8,
                placementRate: 92,
                courses: ["Computer Science", "Mechanical", "Electrical"],
                description: "Top engineering institute with strong placements and research."
            },
            {
                name: "NIT Trichy",
                location: "Tamil Nadu",
                fees: 180000,
                rating: 4.6,
                placementRate: 88,
                courses: ["Computer Science", "Civil", "Production"],
                description: "Leading NIT with balanced academics, campus life, and outcomes."
            },
            {
                name: "BITS Pilani",
                location: "Rajasthan",
                fees: 260000,
                rating: 4.7,
                placementRate: 90,
                courses: ["Computer Science", "Electronics", "Biotechnology"],
                description: "Private deemed university known for flexibility and internships."
            },
            {
                name: "VIT Vellore",
                location: "Tamil Nadu",
                fees: 200000,
                rating: 4.3,
                placementRate: 80,
                courses: ["Computer Science", "Information Technology", "ECE"],
                description: "Large private university with broad course options."
            },
            {
                name: "SRM Institute",
                location: "Tamil Nadu",
                fees: 190000,
                rating: 4.1,
                placementRate: 75,
                courses: ["Computer Science", "Data Science", "ECE"],
                description: "Industry-focused programs with growing startup culture."
            },
            {
                name: "IIT Bombay",
                location: "Maharashtra",
                fees: 230000,
                rating: 4.9,
                placementRate: 94,
                courses: ["Computer Science", "Aerospace", "Chemical"],
                description: "High-impact institute with excellent global reputation."
            }
        ]
    });
}
main()
    .then(async () => {
    await prisma.$disconnect();
})
    .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
});
