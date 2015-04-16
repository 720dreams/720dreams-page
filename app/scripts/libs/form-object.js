function getFormObject(form) {
    var result = {};
    if (!form || form.nodeName !== "FORM") {
        return
    }
    var i, j;
    for (i = form.elements.length - 1; i >= 0; i = i - 1) {
        if (form.elements[i].name === "") {
            continue
        }
        switch (form.elements[i].nodeName) {
            case"INPUT":
                switch (form.elements[i].type) {
                    case"text":
                    case"hidden":
                    case"password":
                    case"button":
                    case"reset":
                    case"submit":
                        result[form.elements[i].name] = form.elements[i].value;
                        break;
                    case"checkbox":
                    case"radio":
                        if (form.elements[i].checked) {
                            result[form.elements[i].name] = form.elements[i].value;
                        }
                        break;
                    case"file":
                        break
                }
                break;
            case"TEXTAREA":
                result[form.elements[i].name] = form.elements[i].value;
                break;
            case"SELECT":
                switch (form.elements[i].type) {
                    case"select-one":
                        result[form.elements[i].name] = form.elements[i].value;
                        break;
                    case"select-multiple":
                        for (j = form.elements[i].options.length - 1; j >= 0; j = j - 1) {
                            if (form.elements[i].options[j].selected) {
                                result[form.elements[i].name] = form.elements[i].value;
                            }
                        }
                        break
                }
                break;
            case"BUTTON":
                switch (form.elements[i].type) {
                    case"reset":
                    case"submit":
                    case"button":
                        result[form.elements[i].name] = form.elements[i].value;
                        break
                }
                break
        }
    }
    return result
};
