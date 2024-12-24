let registerForm = document.querySelector(".registerForm");

let allInput = registerForm.querySelectorAll("INPUT");
let allBtn = registerForm.querySelectorAll("BUTTON");
let closeBtn = document.querySelector(".btn-close");
// console.log(allInput);
let regDataList = document.querySelector(".regData-list");
let addBtn = document.querySelector(".addBtn");
let searchData = document.querySelector(".search");
let delAllBtn = document.querySelector(".deleteAllBtn");

let allRegData = [];
let url = ""

if (localStorage.getItem("CRUD") != null) {
    allRegData = JSON.parse(localStorage.getItem("CRUD"))
}
console.log(allRegData);

//adding data
registerForm.onsubmit = (e) => {
    e.preventDefault();

    let checkEmail = allRegData.find((data) => data.email == allInput[1].value)
    if (checkEmail == undefined) {
        allRegData.push({
            name: allInput[0].value,
            email: allInput[1].value,
            mobile: allInput[2].value,
            dob: allInput[3].value,
            password: allInput[4].value,
            // profile: url == "" ? "profile.jpg" : url
            profile: url

        })
        localStorage.setItem("CRUD", JSON.stringify(allRegData));
        swal("Data Inserted", "Successfully !", "success")
        closeBtn.click();
        registerForm.reset('');
        getRegData();
    }
    else {
        swal("Email Already Exists", "failed !", "warning")
    }
}
// registerForm()


const getRegData = (e) => {
    regDataList.innerHTML = ""
    allRegData.forEach((data, index) => {
        let dataStr = JSON.stringify(data)
        let finalData = dataStr.replace(/"/g, "'")

        // console.log(data, index);
        regDataList.innerHTML +=
            `
         <tr>
            <td>${index + 1}</td>
                <td>
                <img src="${data.profile}" width="35" alt="" />
            </td>
            <td>${data.name}</td>
            <td>${data.email}</td>
            <td>${data.dob}</td>
            <td>${data.mobile}</td>
            <td>${data.password}</td>
            <!-- <td>555</td> -->
            <td>
                <button data="${finalData}" index="${index}" class="btn btn-primary p-1 px-2 editBtn">
                    <i class="fa fa-edit"></i>
                </button>
                <button index="${index}" class="btn btn-danger p-1 px-2 deleteBtn">
                    <i class="fa fa-trash"></i>
                </button>
            </td>
        </tr>
        `

    })
    action()
}

// Action Data 
const action = () => {
    // delete data
    let allDltBtn = regDataList.querySelectorAll(".deleteBtn")
    for (let btn of allDltBtn) {
        btn.onclick = async () => {
            let isConfirm = await confirm()
            // alert(isConfirm)
            if (isConfirm) {
                let index = btn.getAttribute("index");
                allRegData.splice(index, 1);
                localStorage.setItem("CRUD", JSON.stringify(allRegData))
                getRegData()
            }

        }
    }

    //edit Update Data 
    let allEditBtn = regDataList.querySelectorAll(".editBtn")
    for (let btn of allEditBtn) {
        btn.onclick = () => {
            let index = btn.getAttribute("index");
            let dataStr = btn.getAttribute("data");
            let finalData = dataStr.replace(/'/g, '"');
            let data = JSON.parse(finalData)
            // console.log(data );
            addBtn.click();
            allInput[0].value = data.name
            allInput[1].value = data.email
            allInput[2].value = data.mobile
            allInput[3].value = data.dob
            allInput[4].value = data.password
            url = data.profile;
            allBtn[0].disabled = false
            allBtn[1].disabled = true

            allBtn[0].onclick = () => {
                allRegData[index] = {
                    name: allInput[0].value,
                    email: allInput[1].value,
                    mobile: allInput[2].value,
                    dob: allInput[3].value,
                    password: allInput[4].value,
                    profile: url == "" ? "profile.jpg" : url

                }
                localStorage.setItem("CRUD", JSON.stringify(allRegData));
                swal("Data Updated", "Successfully !", "success")
                closeBtn.click();
                registerForm.reset('');
                getRegData();
                allBtn[1].disabled = false
                allBtn[0].disabled = true
            }
            // allInput[5].value = data.profile
            // alert(index)

        }
    }
}

getRegData()

// delete All 
delAllBtn.onclick = async () => {
    let isConfirm = await confirm()
    if (isConfirm) {
        allRegData = [];
        localStorage.removeItem("CRUD")
        getRegData()
    }
    // alert()
}


// let confirm
const confirm = () => {
    return new Promise((resolve, reject) => {
        swal({
            title: "Are you sure?",
            text: "Once deleted, you will not be able to recover this imaginary file!",
            icon: "warning",
            buttons: true,
            dangerMode: true,
        })
            .then((willDelete) => {
                if (willDelete) {
                    resolve(true)
                    swal("Poof! Your imaginary file has been deleted!", {
                        icon: "success",
                    });
                } else {
                    reject(false)
                    swal("Your imaginary file is safe!");
                }
            });
    });
}


// search data
searchData.oninput = () => {
    search()
}

const search = () => {
    let value = searchData.value.toLowerCase();
    let tr = regDataList.querySelectorAll("TR")
    let i;
    for (i = 0; i < tr.length; i++) {
        let allTd = tr[i].querySelectorAll("TD");
        let name = allTd[2].innerHTML;
        let email = allTd[3].innerHTML;
        let mobile = allTd[4].innerHTML;
        if (name.toLocaleLowerCase().indexOf(value) != -1) {
            tr[i].style.display = ''
        }
        else if (email.toLocaleLowerCase().indexOf(value) != -1) {
            tr[i].style.display = ''
        }
        else if (mobile.toLocaleLowerCase().indexOf(value) != -1) {
            tr[i].style.display = ''
        }
        else {
            tr[i].style.display = 'none'
        }
        // console.log(allTd);

    }
    // alert(value)
}

// reading profile
allInput[5].onchange = () => {
    // alert("Image")
    // emage ne binary ma encode karyu... 
    // image sidhi localStorage ma store no thay means binary ma convert karvi... 
    // FileReader Predefined API Chhe || object || instance create karyu...
    let fReader = new FileReader()
    // files is array 
    fReader.readAsDataURL(allInput[5].files[0])
    fReader.onload = (e) => {
        url = e.target.result;
        console.log(url);

    }
}
