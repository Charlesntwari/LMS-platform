 const { PrismaClient } = require ("@prisma/client")

 const database = new PrismaClient();

 async function main() {
    try{
        await database.category.createMany({
            data:[
                {name: "Computer Science"},
                {name: "Videograph"},
                {name: "Graphic Design"},
                {name: "Art"},
                {name: "Theology"}
            ]
        })
    }
    catch(error){
        console.log("error seeding the database categories", error)
    }
    finally{
        await database.$disconnect()
    }
 }
 main()