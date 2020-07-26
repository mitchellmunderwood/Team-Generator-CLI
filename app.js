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

// create array to hold the member objects
let team_members = [];

// Prompt to ask the user what type of employee they want to add
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

// Prompt to get the three basic questions or every employee
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

// Prompt for manager's office number
function managerPrompt(type, data_1) {
    inquirer.prompt([
        {
            message: "What is this Manager's office number?",
            name: "specific",
            type: "input",
        },
    ]).then(function (data_2) {
        new_member(type, data_1, data_2);
        addMemberPrompt();
    });
}

// Prompt for the intern's school
function internPrompt(type, data_1) {
    inquirer.prompt([
        {
            message: "What is the name of this Intern's school?",
            name: "specific",
            type: "input",
        },
    ]).then(function (data_2) {
        new_member(type, data_1, data_2);
        addMemberPrompt();
    });
}

// Prompt to ask for the engineers github
function engineerPrompt(type, data_1) {
    inquirer.prompt([
        {
            message: "What is this Engineers's github username?",
            name: "specific",
            type: "input",
        },
    ]).then(function (data_2) {
        new_member(type, data_1, data_2);
        addMemberPrompt();
    });
}

// switch statement to create the specific team member object
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

// function to create HTML file based on team member objects
function endPrompt() {
    if (team_members.length > 0) {
        console.log("The Team's data has been recieved and an html is now being generated.");
        createHTML(team_members);
        console.log("Your team's file has been generated and is in the 'output' folder.");
    } else {
        console.log("You have not input any team information, no file has been generated.");
    }
}

// function to write the team member to an html file
function createHTML(team) {
    let html_doc = render(createTeam(team));
    fs.writeFile(outputPath, html_doc, function (err) {
        if (err) {
            return console.log(err);
        }
        console.log("Successfully created your html file");
    });


}

// Prompt to ask whether you want to add a team member or not
function addMemberPrompt(boolean) {
    result = "start" ? "a" : "another";
    inquirer.prompt([
        {
            message: `An Engineering Team consists of at least 1 Manager and any number of Engineers and Interns. Would you like to add ${result} team member?`,
            name: "member_add",
            type: "list",
            choices: ["Yes", "No"],
        },
    ]).then(function (data) {
        data.member_add === "Yes" ? memberTypePrompt() : endPrompt();
    })
}

// function to create team members from the required classes
function createTeam(members) {
    return members.map((member) => {
        switch (member.type) {
            case "Manager":
                return new Manager(member.name, member.id, member.email, member.office_number);
            case "Engineer":
                return new Engineer(member.name, member.id, member.email, member.github);
            case "Intern":
                return new Intern(member.name, member.id, member.email, member.school);
        }
    })
}

// function all to start the series of prompts
addMemberPrompt("start");



