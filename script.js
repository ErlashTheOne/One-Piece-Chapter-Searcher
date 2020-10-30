window.onload = function () {

    var prevScrollpos = window.pageYOffset;
    let button = document.querySelector("#searchButton");
    let search = document.querySelector("input[type='search']");
    let header = document.querySelector('.Header');
    let main = document.querySelector('.Main');
    let aside = document.querySelector('aside');

    printFavved(aside);

    document.querySelector('#nav-icon').addEventListener("click", function () {
        this.classList.toggle('open');
        document.querySelector('.Header .menu-right ul').classList.toggle('open');
    });

    window.addEventListener("scroll", function () {
        var currentScrollPos = window.pageYOffset;
        if (prevScrollpos > currentScrollPos && currentScrollPos >= 70) {
            header.classList.add('Header-fixed');
            main.style.marginTop = "100px";
        } else {
            header.classList.remove('Header-fixed');
            main.style.marginTop = "0";
        }
        prevScrollpos = currentScrollPos;
    });

    search.addEventListener("keyup", function (event) {
        if (event.keyCode === 13) {
            event.preventDefault();
            button.click();
        }
    });

    button.addEventListener("click", function () {
        let searchValue = search.value.toLowerCase();
        searchChapter(searchValue);
    });

};


function searchChapter(searchValue) {

    let div = document.querySelector("#data");
    div.innerHTML = "";
    removeChapterIfExist();
    console.clear();

    axios.get('https://onepiececover.com/api/chapters/' + searchValue)
        .then(function (response) {
            console.log(response);

            if (response.data.title) {
                printChapter(response.data, div);

            } else {
                showError("Enter some value.", div);
            }
        })
        .catch(function (error) {
            console.log(error);
            showError("There is no chapter that matches with the entered value.", div);
        })
}

function removeChapterIfExist() {

    let ficha = document.querySelectorAll(".selectedChapter");

    if (ficha) {
        for (let j = 0; j < ficha.length; j++) {
            ficha[j].remove();
        }
    }
}

function printChapter(data, div) {

    let newDiv = document.createElement("div");
    let titleContainer = document.createElement("h2");
    let coverImage = document.createElement("img");
    let chapterContainer = document.createElement("h3");
    let summaryContainer = document.createElement("p");
    let faved = document.createElement("i");

    newDiv.className = "selectedChapter";

    let titleText = document.createTextNode(data.title + " ");
    titleContainer.appendChild(titleText);

    let imgUrl = data.cover_images;
    let characterPosition = imgUrl.indexOf("|");
    let newUrl = imgUrl.slice(characterPosition + 1); //img tamaño pequeño
    //let newUrl = imgUrl.slice(0, characterPosition);//img tamaño real
    coverImage.src = newUrl;

    let chapterText = document.createTextNode(data.chapter);
    chapterContainer.appendChild(chapterText);

    let summaryText = document.createTextNode(data.summary);
    summaryContainer.appendChild(summaryText);

    if (isInFavvedList(data.chapter)) {
        faved.className = "fas fa-star";
    } else {
        faved.className = "far fa-star";
    }

    titleContainer.appendChild(faved);
    newDiv.appendChild(titleContainer);
    newDiv.appendChild(coverImage);
    newDiv.appendChild(chapterContainer);
    newDiv.appendChild(summaryContainer);
    div.appendChild(newDiv);

    document.querySelector(".fa-star").addEventListener("click", function () {
        toggleFav(this, data)
    });
}

function isInFavvedList(selectedChapter) {
    if (listExist()) {
        let chapterList = JSON.parse(localStorage.getItem("chapters"));
        let isFavved = false;
        chapterList.forEach(element => {
            if (element.chapter === selectedChapter) {
                isFavved = true;
            }
        });
        if (isFavved) {
            return true;
        } else {
            return false;
        }
    } else {
        return false;
    }
}

function listExist() {
    let chapter = localStorage.getItem("chapters");
    if (chapter && chapter != "[]") {
        return true;
    } else {
        return false;
    }
}

function toggleFav(icono, chapter) {
    let aside = document.querySelector("aside");
    //Local storage
    // localStorage.setItem("pokeImg", response.data.sprites.front_default);
    // let img = localStorage.getItem("pokeImg");
    // console.log(img);

    if (icono.classList.contains("far")) {

        if (!listExist()) {
            let chapterJSon = [chapter];
            chapterJSon = JSON.stringify(chapterJSon);
            localStorage.setItem("chapters", chapterJSon);

        } else {
            if (!isInFavvedList(chapter.chapter)) {
                let OldChapterList = JSON.parse(localStorage.getItem("chapters"));
                OldChapterList.push(chapter);
                OldChapterList.sort(function (a, b) {
                    return a.id - b.id; //shorting por id
                })
                let newChapterList = JSON.stringify(OldChapterList);
                localStorage.setItem("chapters", newChapterList);
            }
        }

        printFavved(aside);

        icono.classList.remove("far");
        icono.classList.add("fas");

    } else if (icono.classList.contains("fas")) {

        deleteFromFavvedList(chapter);

        printFavved(aside);

        icono.classList.remove("fas");
        icono.classList.add("far");
    }
}

function deleteFromFavvedList(selectedChapter) {
    let chapterList = JSON.parse(localStorage.getItem("chapters"));
    let cont = 0;
    let positionToDelete;
    chapterList.forEach(element => {
        if (element.chapter === selectedChapter.chapter) {
            positionToDelete = cont;
        }
        cont++;
    });
    chapterList.splice(positionToDelete, 1);
    let newChapterList = JSON.stringify(chapterList);
    localStorage.setItem("chapters", newChapterList);
}

function printFavved(aside) {

    removeFavvedListIfExist();

    if (listExist()) {

        let favvedChapter = JSON.parse(localStorage.getItem("chapters"));

        let title = document.createElement("h2");
        let titleText = document.createTextNode("Favved List:");
        title.appendChild(titleText);
        aside.style.marginLeft = "1rem";
        aside.style.padding = "1rem";
        aside.style.width = "30%";
        aside.appendChild(title);

        favvedChapter.forEach(elem => {

            let newDiv = document.createElement("div");
            let summaryContainer = document.createElement("a");

            newDiv.className = "favedChapter";
            summaryContainer.src = "#";

            let summaryText = document.createTextNode(`${elem.id} : ${elem.title}`);
            summaryContainer.appendChild(summaryText);
            summaryContainer.setAttribute("chapterData", JSON.stringify(elem));


            newDiv.appendChild(summaryContainer);
            aside.appendChild(newDiv);
        });

        searchFromFavElements();
    }


}

function removeFavvedListIfExist() {

    let list = document.querySelectorAll(".favedChapter");

    if (list) {
        for (let j = 0; j < list.length; j++) {
            list[j].remove();
        }
    }

    let title = document.querySelector("aside h2");
    if (title) {
        title.remove();
    }

    let aside = document.querySelector("aside");
    aside.style.marginLeft = "0";
    aside.style.padding = "0";
    aside.style.width = "0";
}

function searchFromFavElements() {
    let listItems = document.querySelectorAll("aside a");
    for (let i = 0; i < listItems.length; i++) {
        listItems[i].addEventListener('click', function () {
            let data = JSON.parse(this.getAttribute("chapterData"));
            let div = document.querySelector("#data");
            removeChapterIfExist();
            printChapter(data, div);
        })
    }
}

function showError(string, div) {

    let newDiv = document.createElement("div");
    let pError = document.createElement("p");
    let errorMsg = document.createTextNode(string);

    newDiv.className = "selectedChapter";
    pError.style.color = "red";
    pError.appendChild(errorMsg);
    newDiv.appendChild(pError);
    div.appendChild(newDiv);
}