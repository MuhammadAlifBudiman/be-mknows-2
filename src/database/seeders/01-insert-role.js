"use strict";

/** @type {import("sequelize-cli").Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert("roles", [{
      uuid: "1e516945-88f2-4a90-9ef5-1546d0a0f863",
      name: "ADMIN",
      
      created_at: new Date(),
      updated_at: new Date(),
    }, {
      uuid: "a8e28554-8565-460b-9d33-f82bd26c859a",
      name: "USER",

      created_at: new Date(),
      updated_at: new Date(),
    }], {});
  },

  async down (queryInterface, Sequelize) {
    // await queryInterface.bulkDelete("roles", null, {});
  }
};