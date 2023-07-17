//extracted
import icons from 'url:../../img/icons.svg';//parcel 2
export default class View{
    //using it as a parent class
    _data;
    render(data,render=true)
    {
        if (!data || (Array.isArray(data) && data.length === 0))
        return this.renderError();
        this._data=data;
        const markup=this._generateMarkup();

        if(render===false) return markup;
        this._clear();
        this._parentElement.insertAdjacentHTML('afterbegin',markup);
    }

    update(data)
    {
        if (!data || (Array.isArray(data) && data.length === 0))
        return this.renderError();
        this._data=data;
        const newMarkup=this._generateMarkup();

        const newDOM=document.createRange().createContextualFragment(newMarkup);
        const newElements=Array.from(newDOM.querySelectorAll('*'));
        const curElements=Array.from(this._parentElement.querySelectorAll('*'));
        console.log(newElements);


        newElements.forEach((newEl,i)=>
        {
            const curEl=curElements[i];
            console.log(curEl,newEl.isEqualNode(curEl));

            //Updates Changed Attributes
            if(!newEl.isEqualNode(curEl) && newEl.firstChild?.nodeValue.trim()!='')//to check for test we use nodevalue
            {
                console.log(newEl.firstChild?.nodeValue.trim());
                curEl.textContent=newEl.textContent;
            }


            if(!newEl.isEqualNode(curEl))//to check for test we use nodevalue
            {
                console.log(newEl.attributes);
                Array.from(newEl.attributes).forEach(attr=>curEl.setAttribute(attr.name,attr.value));//simply replace all the attributes that are diff from the current element
            }
        })
    }

    _clear()
    {
        console.log(this._parentElement);
        this._parentElement.innerHTML='';

        
    }

    //for render animation
    renderSpinner() {
        const markup = `
        <div class="spinner">
        <svg>
        <use href="${icons}#icon-loader"></use>
        </svg>
    </div>`;
        this._clear();
        this._parentElement.insertAdjacentHTML('afterbegin', markup);
    };

    //needs to be a part of public API
    addHandlerRender(handler)
    {
        ['hashchange','load'].forEach(ev=>window.addEventListener(ev,handler));
    }

    renderError(message=this._errorMessage)
    {
        const markup=
        `
        <div class="error">
        <div>
            <svg>
            <use href="${icons}_icon-alert-triangle"></use>
            </svg>
        </div>
        <p>No recipes found for your query. Please try again!</p>
        </div>
        `;
        this._clear();
        this._parentElement.insertAdjacentHTML('afterbegin', markup);
    }

    renderMessage(message=this._message)
    {
        const markup=
        `
        <div class="message">
        <div>
            <svg>
            <use href="${icons}_icon-smile"></use>
            </svg>
        </div>
        <p>${message}</p>
        </div>
        `;
        this._clear();
        this._parentElement.insertAdjacentHTML('afterbegin', markup);
    }


}