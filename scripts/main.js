/* Simple TODO App Inspired By Trello.

 * More about this app :
   1. No External Library used , how ever some CSS have been inspired by bootstrap and other open source projects.
   2. A user can add n Number of Pending List, If No List name is provided, The list is named as General
   3. A user can edit or delete an existing Todo.
   4. I have tried to use as less as CSS3 possible to make it compitable with older browser.
   5. Project Cotains no iframe.
   6. Currently The data store is NON PERSISTANT which means that on refesh the data is lost.
   7. This app if mobile friendly and works in smaller width screen as well.
 * author : Sanyam Agrawal
 * Date : 25/06/2014
 * Editor : SublimeText2
 * Linting : JS lint
 */

/*Following Reveling Modular Pattern(IIFE) in this code base so that the global namespace is not populated
 * app contains 3 methods which are exposed to the public , rest all the functions and variables are private
 */
var app = (function() {

    var todoList = {};

    /* App must allow users to create multiple TODO List.
     * E.g: Pending List, On hold List, Completed List etc.
     * This constructor supports adding todos to individual list
     * We have scoped List to app
     * @type : private Constructor
     * @param : name of the new List
     */
    var List = function() {

        /*  Private Static Variable :
         *  Will Be Initialized Only Once.
         *  Used To Generate ID's For List of Todo
         */
        var listIdGenerator = 0;

        //Function to generate Id For TodoList. Currently its a simple generator which can be used to create
        //Complicated ID as well.
        function generateId() {
            return ++listIdGenerator;
        }

        return function(todoListName) {

            /* Todo is an object and not an array because we support deleting a todo.
             * and as such we do not need to iterate over an array to retrive which to do
             * needs to be deleted. WE can think of it as MAP of Todo's
             */

            //Implementing Data hiding and Encuplation: Private Members Through Closures
            var todo = {},
                name,
                id;

            //Sets Name of a List, If Undefined falls back to "UnNamed List"
            this.setName = function(listName) {
                name = listName || "UnNamed List";
            }

            //return the name of the list
            this.getName = function() {
                return name;
            };

            //Method To Set Id Of a List Internally
            this.setId = function() {
                id = generateId();
            };

            //returns the id of the list
            this.getId = function() {
                return id;
            };

            //adds a new Todo to the list
            this.addTodo = function(newTodo) {
                todo[newTodo.getId()] = newTodo;
            };

            //removes a todo from the list
            this.removeTodo = function(id) {
                if (todo[id]) {
                    return delete todo[id];
                }
            };

            //sends the whole list of todo's
            this.getTodoList = function() {
                return todo;
            };

            this.setName(todoListName);
            this.setId();
        };
    }();


    /*  Constructor for todo. Currently Supports only Adding Description.
     *  We can add the functionality of status as well.
     *  THis Function acts as a Class to instantiate new instances for todo's
     *  @type : Private constructor
     *  @param : Description : the description of the todo
     */

    Todo = function() {

        var todoIdGenerator = 101;

        function generateId() {
            return ++todoIdGenerator;
        }

        return function(descrp) {

            var description,
                id;

            //Getter and Setter for Description Of A Todo
            this.setDescription = function(desc) {
                description = desc;
            };

            this.getDescription = function() {
                return description;
            };

            //Getter and Setter for Id
            this.setId = function() {
                id = generateId();
            };

            this.getId = function() {
                return id;
            };

            this.setId();
            this.setDescription(descrp);
        }
    }();

    /* Function to toggle the Add New List Button and show A textbox and Add Button Node
     * To Accept New List.
     * @type : function, public
     */
    function showNewListNode() {
        var addListNode = document.getElementById("newListNode"),
            newListButton = document.getElementById("addListButton"),
            listName = document.getElementById("listName");

        hideNode(newListButton);
        showNode(addListNode);
        listName.value = "";
    }

    /* Function To Hide the textBox and Search Button and show The Create a List Button
     * @type : public, function
     */
    function showAddNewListNode() {
        var addListNode = document.getElementById("newListNode"),
            newListButton = document.getElementById("addListButton");

        showNode(newListButton);
        hideNode(addListNode);
    }

    /*User should be able to add a new List on Key press or on create new List Button
     * @type : public, function
     */
    function handleKeyPress(event) {
        if (event.keyCode === 13) {
            appendList();
        }
        //return false;
    }

    /* Creates a new list of TOdo and calls the initial rendering function.*/
    function appendList() {

        var listNode = document.getElementById("listName"),
            listName = listNode.value,
            list;

        list = new List(listName);
        showAddNewListNode();
        todoList[list.getId()] = list;
        renderList(list);
    }

    /* Important function To show the List In UI
     * initially it will contain the following
     *  1. Name of the list,
     *  2. A hidden Div to store all the todo's which will be added,
     *  3. A link to allow users to add new Todo
     *  4. a hidden node for users to add new Todo and save them.

     @TYPE : PRIVATE, function
     */
    function renderList(list) {
        var mainContainer,
            todoTitle,
            todoContainer,
            linkNode,
            addTodoContainer,
            textarea,
            buttonNode,
            addButton,
            hideNode,
            listId = list.getId(),
            node = document.getElementById("list-area");

        //List Main Container
        mainContainer = document.createElement("div");
        mainContainer.setAttribute("class", "list");
        mainContainer.setAttribute("id", listId);

        //List Header
        todoTitle = document.createElement("div");
        todoTitle.classList.add("list-header-name");
        todoTitle.innerHTML = list.getName();
        mainContainer.appendChild(todoTitle);

        //ToDo Container
        todoContainer = document.createElement("div");
        todoContainer.classList.add("list-cards");
        todoContainer.setAttribute("id", "cards_" + listId);
        mainContainer.appendChild(todoContainer);

        //Add New Todo Link Node
        linkNode = document.createElement("a");
        linkNode.setAttribute("class", "open-card-composer");
        linkNode.setAttribute("id", "button_" + listId);
        linkNode.innerHTML = "Add a todo...";
        linkNode.addEventListener("click", showAddTodoNode);
        linkNode.parentId = listId;
        mainContainer.appendChild(linkNode);

        //Node To Add New Todo's
        addTodoContainer = document.createElement("div");
        addTodoContainer.setAttribute("id", "addNode_" + listId);
        addTodoContainer.setAttribute("class", "list-add-container hide");
        mainContainer.appendChild(addTodoContainer);


        //text Area to to get the description of the Todo
        textarea = document.createElement("textarea");
        textarea.setAttribute("id", "addTODO_" + listId);
        addTodoContainer.appendChild(textarea);

        //Button Node which shows Button to Add A new TODo to the list and X to hide once done
        buttonNode = document.createElement("div");
        buttonNode.setAttribute("class", "tableRow");
        addTodoContainer.appendChild(buttonNode);

        //Add Button
        addButton = document.createElement("input");
        addButton.setAttribute("type", "button");
        addButton.setAttribute("name", "Add");
        addButton.setAttribute("value", "Add");
        addButton.setAttribute("class", " tableCell primary");
        addButton.setAttribute("id", "newTodo_" + listId);
        addButton.addEventListener("click", saveTodo);
        buttonNode.appendChild(addButton);

        //X Button to hide add todo node
        hideNode = document.createElement("span");
        hideNode.setAttribute("class", "tableCell crossIcon");
        hideNode.addEventListener("click", hideAddTodoNode);
        hideNode.parentId = listId;
        buttonNode.appendChild(hideNode);

        //Finally add the main List Container which contains all the details to the list container
        node.appendChild(mainContainer);
    }

    /*utility method to show the textaea for user to add new Todo*/
    function showAddTodoNode(event) {
        var parentId = event.target.parentId,
            nodeToShow = document.getElementById("addNode_" + parentId),
            nodeToHide = document.getElementById("button_" + parentId);

        hideNode(nodeToHide);
        showNode(nodeToShow);
    }
    /*Utility method to show Add A todo Link*/
    function hideAddTodoNode(event) {
        var parentId = event.target.parentId,
            nodeToHide = document.getElementById("addNode_" + parentId),
            nodeToShow = document.getElementById("button_" + parentId);

        hideNode(nodeToHide);
        showNode(nodeToShow);
    }

    /*Saves the description of a Todo to the List and Renders to to the UI by calling the render function*/
    function saveTodo(event) {
        var parentId = event.target.id.split("_")[1],
            currentTodo = document.getElementById("addTODO_" + parentId),
            list = todoList[parentId],
            newTodo;

        if (currentTodo.value) {
            newTodo = new Todo(currentTodo.value);
            currentTodo.value = "";
            list.addTodo(newTodo);
            renderTodo(newTodo, list);

        }
    }

    /*Shows a Todo List in the UI , By creating it dynamically*/
    function renderTodo(todo, list) {
        var div,
            temp,
            name,
            icons,
            parentId = list.getId(),
            node = document.getElementById("cards_" + parentId),
            editButton = document.createElement("span"),
            deleteButton = document.createElement("span");

        div = document.createElement("div");
        div.classList.add("list-card");
        div.setAttribute("id", todo.getId());

        temp = document.createElement("div");
        temp.classList.add("list-card-details");
        div.appendChild(temp);

        name = document.createElement("span");
        name.setAttribute("id", "desc_" + todo.getId());
        name.innerHTML = todo.getDescription();
        temp.appendChild(name);

        icons = document.createElement("div");
        icons.classList.add("icons");
        temp.appendChild(icons);

        editButton.setAttribute("class", "editIcon");
        editButton.todo = todo;
        editButton.parentId = parentId;
        editButton.addEventListener("click", editTodo);
        icons.appendChild(editButton);

        deleteButton.setAttribute("class", "deleteIcon");
        deleteButton.todo = todo;
        deleteButton.parentId = parentId;
        deleteButton.addEventListener("click", deleteTodo);
        icons.appendChild(deleteButton);

        node.appendChild(div);
    }

    /*Function To create a text box and render the value and hide the div so that the user can edit the todo*/
    function editTodo(event) {
        var node = event.target,
            parentId = node.parentId,
            todoId = node.todo.getId(),
            todoNode = document.getElementById(todoId),
            editNode = document.getElementById("editNode_" + todoId),
            desc;


        if (!editNode) {
            editNode = getEditTodoNode(node.todo, parentId);
            todoNode.appendChild(editNode);

        } else {
            desc = document.getElementById("editTODO_" + todoId).value = node.todo.getDescription();
        }
        hideNode(todoNode.childNodes[0]);
        showNode(todoNode.childNodes[1]);
    }

    /*Creates the Edit Node for an individual todo which will be shown in the UI */
    function getEditTodoNode(todo, parentId) {

        var div,
            todoId = todo.getId(),
            todoDesc,
            buttonnode;

        div = document.createElement("div");
        div.setAttribute("id", "editNode_" + todoId);

        todoDesc = document.createElement("input");
        todoDesc.setAttribute("type", "text");
        todoDesc.setAttribute("id", "editTODO_" + todoId);
        todoDesc.value = todo.getDescription();
        div.appendChild(todoDesc);

        buttonnode = document.createElement("span");
        buttonnode.setAttribute("class", "icons tickIcon");
        buttonnode.parentId = parentId;
        buttonnode.todo = todo;
        buttonnode.addEventListener("click", saveEditTodo);
        div.appendChild(buttonnode);

        return div;
    }

    /* Function to save the newly edited Todo and replacing the old one */
    function saveEditTodo(event) {
        var buttonNode = event.target,
            parentId = buttonNode.parentId,
            oldTodo = buttonNode.todo,
            todoId = oldTodo.getId(),
            currentTodo = document.getElementById("editTODO_" + todoId),
            newDescription = currentTodo.value,
            todoNode = document.getElementById(todoId);

        if (newDescription) {
            oldTodo.setDescription(newDescription);
            document.getElementById("desc_" + todoId).innerHTML = newDescription;
            showNode(todoNode.childNodes[0]);
            hideNode(todoNode.childNodes[1]);
        }
    }

    /*Function to delete a todo from the Sortage*/
    function deleteTodo(event) {
        var node = event.target,
            parentId = node.parentId,
            todoId = node.todo.getId(),
            list = todoList[parentId];

        if (list) {
            list.removeTodo(todoId);
            removeTodoFromUI(todoId);
        }
    }

    /*Function to delete a todo from the UI*/
    function removeTodoFromUI(todoId) {
        var todoNode = document.getElementById(todoId),
            parentNode = todoNode.parentElement;

        parentNode.removeChild(todoNode);
    }

    /*---START OF UTILITY FUNCTIONS. HELPER METHODS FOR THE APPLICATION---*/

    /* Function To Show A particular Node
     * @param : node to show
     * @type : private
     */
    function showNode(node) {
        node.classList.remove("hide");
        node.classList.add("show");
    }

    /* Function To Hide A particular Node
     * @param : node to hide
     * @type : private
     */
    function hideNode(node) {
        node.classList.remove("show");
        node.classList.add("hide");
    }

    /* Reveling Modular Pattern. Only Expose a certain set of API to the user*/
    return {
        showNewListNode: showNewListNode,
        appendList: appendList,
        handleKeyPress: handleKeyPress,
        showAddNewListNode: showAddNewListNode
    };

})(this);