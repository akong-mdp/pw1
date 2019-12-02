const ResApi = {
    format: "json",
    base: "https://gorest.co.in/public-api",
    Authorization: "Bearer MYDrcmnPTikagBMng61wOzFKBog2SyC_u2JD",
    activePage: 1,
    activeID: null
}
document.getElementById('search').addEventListener('keyup', function() {
    getUser(1, this.value)
})
document.getElementById('insert-user').addEventListener('click', (evt) => {
    var gender = document.getElementsByClassName('gender');
    if (gender[0].checked == true) {
        gender = 'male';
    } else {
        gender = 'female';
    }
    var data = ({
        'first_name': document.getElementById('first_name').value,
        'last_name': document.getElementById('last_name').value,
        'email': document.getElementById('email').value,
        'dob': document.getElementById('date').value,
        'gender': gender,
        'phone': document.getElementById('Phone').value,
        'address': document.getElementById('address').value,
        'website': document.getElementById('Website').value
    });
    SaveData(data);
    evt.preventDefault();
})

document.getElementById('delete-user').addEventListener('click', () => {
    deleteUser(ResApi.activeUserID)
})

function setFormData(data) {
    console.log(data);
    document.getElementById('profil').setAttribute('src', data._links.avatar.href)
    document.getElementById('first_name').value = data.first_name
    document.getElementById('last_name').value = data.last_name
    document.getElementById('email').value = data.email
    document.getElementById('Website').value = data.website
    document.getElementById('Phone').value = data.phone
    document.getElementById('gender-' + data.gender).checked = true
    document.getElementById('date').value = data.dob
    document.getElementById('address').value = data.address
}

function removeActiveClass(el) {
    var child = el.children;

    for (var i = 0; i < child.length; i++) {
        child[i].classList.remove('active')
    }
}

function listUserClicked(event, userData) {
    var li = event.target;
    update(userData.id)
    removeActiveClass(li.parentElement)
    li.classList.add('active')
    setFormData(userData)
}

function SaveData(formData) {

    fetch(`${ResApi.base}/users`, {
            'method': 'POST',
            'headers': {
                'Content-Type': 'application/json',
                "Authorization": ResApi.Authorization
            },
            'body': JSON.stringify(formData)
        })
        .then((result) => result.json())
        .then(object => {
            if (object._meta.success) {
                alert("Berhasil Menyimpan Data");
                getUser(ResApi.activePage)
            }
        })
}

function update(user) {
    document.getElementById('update-user').addEventListener('click', () => {

        var gender = document.getElementsByClassName('gender');
        if (gender[0].checked == true) {
            gender = 'male';
        } else {
            gender = 'female';
        }

        let data = {
            'first_name': document.getElementById('first_name').value,
            'last_name': document.getElementById('last_name').value,
            'email': document.getElementById('email').value,
            'gender': gender,
            'dob': document.getElementById('date').value,
            'phone': document.getElementById('Phone').value,
            'address': document.getElementById('address').value,
            'website': document.getElementById('Website').value
        };

        var config = {
            method: 'PUT',
            headers: {
                Authorization: ResApi.Authorization,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        }


        fetch(`${ResApi.base}/users/${user}`, config)
            .then((result) => result.json())
            .then((object) => {
                console.log(object)

                if (object._meta.success) {
                    alert('Update berhasil!')
                    getUser(ResApi.activePage)
                }
            })
    })

}

function deleteUser(userID) {
    var config = {
        method: 'DELETE',
        headers: {
            Authorization: ResApi.Authorization
        }
    }

    fetch(`${ResApi.base}/users/${userID}`, config)
        .then((result) => result.json())
        .then((object) => {
            if (object._meta.success) {
                alert('hapus berhasil!')
                getUser(ResApi.activePage);
            }
        })
}

function getUser(page, firstName) {
    var config = {
        method: 'GET',
        headers: {
            Authorization: ResApi.Authorization
        }
    }

    var searchFirstName = '';
    if (firstName) {
        searchFirstName = `&first_name=${firstName}`
    }

    fetch(
            `${ResApi.base}/users?_format=${ResApi.format}&page=${page}${searchFirstName}`,
            config
        )
        .then((result) => result.json())
        .then((object) => {

            ResApi.activePage = page;

            var ul = document.getElementById('user-list')

            ul.innerHTML = ''

            object.result.forEach((data) => {

                var li = document.createElement('li')
                li.setAttribute('class', 'list-group-item')
                li.textContent = data.first_name


                li.addEventListener('click', (event) => {
                    ResApi.activeUserID = data.id
                    listUserClicked(event, data)
                })

                ul.append(li);
            })

        })
}
getUser(ResApi.activePage);