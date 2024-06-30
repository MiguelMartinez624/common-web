import {TaskComment, TaskItem, TaskState, User} from "./model";

export function generateRandomTaskItems(minItems, maxItems) {
    // Ensure minItems is less than or equal to maxItems
    minItems = Math.min(minItems, maxItems);

    // Generate a random number of items between min and max (inclusive)
    const numItems = Math.floor(Math.random() * (maxItems - minItems + 1)) + minItems;

    const taskItems = [];
    for (let i = 0; i < numItems; i++) {
        taskItems.push(generateRandomTaskItem());
    }

    return taskItems;
}

export function generateRandomTaskItem() {
    const id = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    const title = generateRandomString(10, 20);
    const description = generateRandomString(20, 1000);
    const state = TaskState.Pending // Get random TaskState value
    const comments = generateRandomComments(1, 203);
    const testuser = new User("test", "Miguel", "Martinez","test");

    return new TaskItem(id, title, description, null, testuser, state, comments);
}

function generateRandomString(minLength, maxLength) {
    const length = Math.floor(Math.random() * (maxLength - minLength + 1)) + minLength;
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789 ";
    let result = "";
    for (let i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
}

export function generateRandomComments(minComments, maxComments) {
    // Ensure minComments is less than or equal to maxComments
    minComments = Math.min(minComments, maxComments);

    // Generate a random number of comments within the specified range
    const numComments = Math.floor(Math.random() * (maxComments - minComments + 1)) + minComments;

    const comments = [];
    for (let i = 0; i < numComments; i++) {
        comments.push(generateRandomComment());
    }

    return comments;
}

export function generateRandomComment() {
    const id = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    const content = generateRandomString(5, 20); // Adjust length as needed
    const creationDate = new Date(Date.now() - Math.random() * 1000 * 60 * 60 * 24 * 30); // Random date within the last 30 days

    return new TaskComment(id, content, creationDate);
}

function getRandomEnum(enumObject) {
    const enumValues = Object.values(enumObject);
    console.log({enumValues})
    const randomIndex = Math.floor(Math.random() * enumValues.length);
    return enumValues[randomIndex];
}


