const formElement=document.querySelector('form');
const taskNameInput=document.querySelector('input');
const loadingScreen=document.querySelector('.loading');
let apiKey='675b4dca60a208ee1fde130b';
let allTodos=[];
getAllTodos();
formElement.addEventListener("submit",(e)=>{
e.preventDefault();
if(taskNameInput.value.trim().length>0){
    addToDo();
}
})

async function addToDo(){
    showLoading()
    const todo={
        "title":taskNameInput.value,
        "apiKey":apiKey
    }
const obj={
    method:"POST",
    body:JSON.stringify(todo),
    headers:{
        "content-type":"application/json"
    }
}



    const response= await fetch('https://todos.routemisr.com/api/v1/todos',obj);

   
    if(response.ok){
        const data= await response.json();
        if(data.message==="success"){
         await getAllTodos();
         toastr.success('Added Successfully!', 'toastr App')
            formElement.reset();
        }
    }
hideLoading();
    
}
async function getAllTodos(){
showLoading();
    const response=await fetch(`https://todos.routemisr.com/api/v1/todos/${apiKey}`);
    if(response.ok){
        const data=await response.json();
        console.log(data);
        
        if(data.message==="success"){
           allTodos=  data.todos;
           displayTodos();          
        }
    }
    hideLoading();
}


function displayTodos(){
    let cartona=``;
    for(const todo of allTodos){
      cartona+=`
        <li class="task d-flex align-items-center justify-content-between border-bottom pb-2 my-2">
            <span onclick="markCompleted('${todo._id}')" style="${todo.completed?'text-decoration:line-through':''}" class="task-name">${todo.title}</span>
            <div class="d-flex align-items-center gap-4">
                ${todo.completed?'<span ><i class="fa-regular fa-circle-check" style="color: #63E6BE;"></i></span>':''}
                <span onclick="deleteTodo('${todo._id}')" class="icon"><i class="fa-solid fa-trash-can"></i></span>
            </div>
        </li>
      `
    }
    document.querySelector('.task-container').innerHTML=cartona;
    changeProgress()
}
async function deleteTodo(id){

    Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!"
      }).then(async (result) => {
        if (result.isConfirmed) {
            showLoading()
            const todoId={
                "todoId":id,
            }
            const obj={
                method:"DELETE",
                body:JSON.stringify(todoId),
                headers:{
                    "content-type":"application/json",
                }
            }
            
            
            const todoData=await fetch('https://todos.routemisr.com/api/v1/todos',obj);
            
            if(todoData.ok){
                const response=await todoData.json();
                console.log(response);
                if(response.message==="success"){
                    Swal.fire({
                        title: "Deleted!",
                        text: "Your file has been deleted.",
                        icon: "success"
                      });
                   await getAllTodos();
                }
            }
        hideLoading()
        }
      });

}
async function markCompleted(todoId){
    Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, complete it!"
      }).then(async (result) => {
        if (result.isConfirmed) {
            showLoading();
            const dataId={
                "todoId":todoId
           }
           const obj={
               method:"PUT",
               body:JSON.stringify(dataId),
               headers:{
                   "content-type":"application/json",
               }
           }
           
           
           
           const response=await fetch('https://todos.routemisr.com/api/v1/todos',obj);
           if(response.ok){
               const data=await response.json();
               if(data.message==="success"){
                Swal.fire({
                    title: "completed!",
                    icon: "success"
                  });
                  await getAllTodos();
               }
           }
           hideLoading()
        }
      });

}
function showLoading(){
    loadingScreen.classList.remove('d-none');
}
function hideLoading(){
    loadingScreen.classList.add('d-none');
}
function changeProgress(){
    const completedTodo=allTodos.filter((todo)=>todo.completed).length;
    const totalTodos=allTodos.length;
    document.getElementById('progress').style.width=`${(completedTodo/totalTodos)*100}%`;
 const statusNumber=   document.querySelectorAll('.status-number span');
 statusNumber[0].innerHTML=completedTodo;
 statusNumber[1].innerHTML=totalTodos;

}