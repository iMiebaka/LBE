import initDB from "../database/db"


describe("check database", () => {
    it("can connect", async () => {
        await initDB.raw('SELECT 1 + 1 AS result')
            .then((result) => {
                expect(result[0][0].result).toBe(2)
            })
            .catch(() => {
                expect(true).toBe(false)
            });
    })
})