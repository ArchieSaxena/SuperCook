import icons from 'url:../../img/icons.svg';
import View from './View.js';
class PaginationView extends View{
    _parentElement=document.querySelector('.pagination');
    addHandlerClick(handler)
    {
        this._parentElement.addEventListener('click',function(e)
        {
            const btn=e.target.closest('.btn--inline');
            //search up the trees and look for parents does the closest fxn
            // console.log(btn);
            if(!btn) return;
            const gotoPage=+btn.dataset.goto;
            // console.log(gotoPage);
            handler(gotoPage);
        })
    }
    _generateMarkup()
    {
        const curPage=this._data.page;
        const numPages=Math.ceil(this._data.results.length/this._data.resultsPerPage);
        console.log(numPages);
        //page1,and there are other pages
        if(this._data.page==1 && numPages>1)
        {
            return `
                <button data-goto="${curPage+1}" class="btn--inline pagination__btn--next">
                <span>Page ${curPage+1}</span>
                <svg class="search__icon">
                <use href="${icons}#icon-arrow-right"></use>
                </svg>
            </button>
            `;
        }

        

        //last page
        if(numPages===this._data.page && numPages>1)
        {
            return `
                <button data-goto="${curPage-1}" class="btn--inline pagination__btn--prev">
                <svg class="search__icon">
                <use href="${icons}#icon-arrow-left"></use>
                </svg>
                <span>Page ${curPage-1}</span>
            </button>
            `;
        }

        //other page
        if(this._data.page<numPages)
        {
            return `
                <button data-goto="${curPage-1}" class="btn--inline pagination__btn--prev">
                <svg class="search__icon">
                <use href="${icons}#icon-arrow-left"></use>
                </svg>
                <span>Page ${curPage-1}</span>
            </button>
                <button data-goto="${curPage+1}" class="btn--inline pagination__btn--next">
                <span>Page ${curPage+1}</span>
                <svg class="search__icon">
                <use href="${icons}#icon-arrow-right"></use>
                </svg>
            </button>
            `;
        }

        //page1 and there are no other pages
        return '';
    }
}

export default new PaginationView();