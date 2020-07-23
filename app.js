const Manager = require("./lib/Manager");
const Engineer = require("./lib/Engineer");
const Intern = require("./lib/Intern");
const inquirer = require("inquirer");
const path = require("path");
const fs = require("fs");

const OUTPUT_DIR = path.resolve(__dirname, "output");
const outputPath = path.join(OUTPUT_DIR, "team.html");

const render = require("./lib/htmlRenderer");
const ExpandPrompt = require("inquirer/lib/prompts/expand");
const { ppid } = require("process");


// Write code to use inquirer to gather information about the development team members,
// and to create objects for each team member (using the correct classes as blueprints!)

let team_members = [];

function memberTypePrompt() {
    inquirer.prompt([
        {
            message: "What type of team member would you like to add?",
            name: "member_type",
            type: "list",
            choices: ["Engineer", "Intern", "Manager"],
        },
    ]).then(function (data) {
        EmployeePrompt(data.member_type);
    })
}

function EmployeePrompt(type) {
    inquirer.prompt([
        {
            message: "What is the team member's name?",
            name: "name",
            type: "input",
        },
        {
            message: "What is the team member's id number?",
            name: "id",
            type: "input",
        },
        {
            message: "What is the team member's email?",
            name: "email",
            type: "input",
        },
    ]).then(function (data) {
        switch (type) {
            case "Manager":
                managerPrompt(type, data);
                break;
            case "Intern":
                internPrompt(type, data);
                break;
            case "Engineer":
                engineerPrompt(type, data);
                break;
        }
    })
}

function managerPrompt(type, data_1) {
    inquirer.prompt([
        {
            message: "What is this Manager's office number?",
            name: "specific",
            type: "input",
        },
    ]).then(function (data_2) {
        new_member(type, data_1, data_2);
        addMemberPrompt(true);
    });
}

function internPrompt(type, data_1) {
    inquirer.prompt([
        {
            message: "What is the name of this Intern's school?",
            name: "specific",
            type: "input",
        },
    ]).then(function (data_2) {
        new_member(type, data_1, data_2);
        addMemberPrompt(true);
    });
}

function engineerPrompt(type, data_1) {
    inquirer.prompt([
        {
            message: "What is this Engineers's github username?",
            name: "specific",
            type: "input",
        },
    ]).then(function (data_2) {
        new_member(type, data_1, data_2);
        addMemberPrompt(true);
    });
}

function new_member(type, data_1, data_2) {
    let new_object = { type: type, name: data_1.name, id: data_1.id, email: data_1.email };
    switch (type) {
        case "Manager":
            new_object.office_number = data_2.specific;
            break;
        case "Intern":
            new_object.school = data_2.specific;
            break;
        case "Engineer":
            new_object.github = data_2.specific;
            break;
    }
    team_members.push(new_object);
}

function endPrompt() {
    console.log("The Team's data has been recieved and an html is now being generated.");
    console.log("Here is your team breakdown", team_members)
}

function addMemberPrompt(boolean) {
    result = boolean ? "another" : "a";
    inquirer.prompt([
        {
            message: `Would you like to add ${result} team member?`,
            name: "member_add",
            type: "list",
            choices: ["Yes", "No"],
        },
    ]).then(function (data) {
        console.log(data.member_add);
        data.member_add === "Yes" ? memberTypePrompt() : endPrompt();
    })
}

addMemberPrompt(false);





// After the user has input all employees desired, call the `render` function (required
// above) and pass in an array containing all employee objects; the `render` function will
// generate and return a block of HTML including templated divs for each employee!

// After you have your html, you're now ready to create an HTML file using the HTML
// returned from the `render` function. Now write it to a file named `team.html` in the
// `output` folder. You can use the variable `outputPath` above target this location.
// Hint: you may need to check if the `output` folder exists and create it if it
// does not.

// HINT: each employee type (manager, engineer, or intern) has slightly different
// information; write your code to ask different questions via inquirer depending on
// employee type.

// HINT: make sure to build out your classes first! Remember that your Manager, Engineer,
// and Intern classes should all extend from a class named Employee; see the directions
// for further information. Be sure to test out each class and verify it generates an
// object with the correct structure and methods. This structure will be crucial in order
// for the provided `render` function to work! ```
