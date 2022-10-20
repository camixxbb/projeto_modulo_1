let cart = [];
let modalQt = 0;
let key = 0;
//constante para carregar estrutura, limpando o código
const c = (el)=>document.querySelector(el); //para localizar o primeiro item
const cs = (el)=>document.querySelectorAll(el); //para localizar todos os itens


//Criando a lista de pacotes
modelsJson.map((item, index) => {

    let modelsItem = c('.models .models-item').cloneNode(true);

    modelsItem.setAttribute('data-key', index);
    modelsItem.querySelector('.models-item--img img').src= item.img;
    modelsItem.querySelector('.models-item--price').innerHTML = `R$ ${item.price[0].toFixed(2)}`;
    modelsItem.querySelector('.models-item--name').innerHTML = item.name;
    modelsItem.querySelector('.models-item--desc').innerHTML = item.description;
    //Vai abrir o Modal - Janela
    modelsItem.querySelector('a').addEventListener('click', (e)=>{
        e.preventDefault();

        key = e.target.closest('.models-item').getAttribute('data-key'); //pegando informação do identificador
        modalQt = 1;
        //Alimentando os dados do Modal
        c('.modelsBig img').src = modelsJson[key].img;
        c('.modelsInfo h1').innerHTML = modelsJson[key].name;
        c('.modelsInfo--desc').innerHTML = modelsJson[key].description;

        c('.modelsInfo--size.selected').classList.remove('selected');
        cs('.modelsInfo--size').forEach((size, sizeIndex)=>{
            if(sizeIndex == 2) {
                size.classList.add('selected');
                c('.modelsInfo--actualPrice').innerHTML = `R$ ${modelsJson[key].price[sizeIndex].toFixed(2)}`;
            }

            size.querySelector('span').innerHTML = modelsJson[key].sizes[sizeIndex];
        });
        c('.modelsInfo--qt').innerHTML = modalQt;
        //Mostrar a janela Modal
        c('.modelsWindowArea').style.opacity = 0; //criando uma animação

        c('.modelsWindowArea').style.display = 'flex';
        setTimeout(()=> {
            c('.modelsWindowArea').style.opacity = 1; //mostrando a janela, sem Timeout, não vemos o efeito
        }, 200);
    });

    //preenchendo as informações no site

    c('.models-area').append(modelsItem);
});

//Ações do Modal - janela
function closeModal(){
    c('.modelsWindowArea').style.opacity = 0; //criando uma animação
    setTimeout(()=> {
        c('.modelsWindowArea').style.display = 'none'; //fechando a janela, sem Timeout, não vemos o efeito
    }, 500);
    //mostrar o funcionamento via console do navegador, antes de atribuir aos botões
}

cs('.modelsInfo--cancelButton, .modelsInfo--cancelMobileButton').forEach((item)=>{
    item.addEventListener('click', closeModal);
});

c('.modelsInfo--qtmenos').addEventListener('click', ()=>{
    if(modalQt > 1) {
        modalQt--;
        c('.modelsInfo--qt').innerHTML = modalQt;
    }
});

c('.modelsInfo--qtmais').addEventListener('click', ()=>{
    modalQt++;
    c('.modelsInfo--qt').innerHTML = modalQt;
});

cs('.modelsInfo--size').forEach((size, sizeIndex)=>{
    size.addEventListener('click', (e)=> {
        c('.modelsInfo--size.selected').classList.remove('selected');

        size.classList.add('selected');
        c('.modelsInfo--actualPrice').innerHTML = `R$ ${modelsJson[key].price[sizeIndex].toFixed(2)}`;
    });
});

c('.modelsInfo--addButton').addEventListener('click', ()=>{
    ;
    let size = parseInt(c('.modelsInfo--size.selected').getAttribute('data-key'));
    
    let identifier = modelsJson[key].id+'@'+size;
    //vamos verificar se este identificador já está no carrinho
    let locaId = cart.findIndex((item)=>item.identifier == identifier);
    //se tiver adiciona a quantidade no item já existente, senão acrescento
    if(locaId > -1){
        cart[locaId].qt += modalQt;
    } else {
        cart.push({
            identifier,
            id:modelsJson[key].id,
            size,
            qt:modalQt
        });
    }
    updateCart();
    closeModal();
});

//ajustando o mobile
c('.menu-openner').addEventListener('click', ()=>{
    if(cart.length > 0){
        c('aside').style.left = '0';
    }
});

c('.menu-closer').addEventListener('click', ()=>{
    c('aside').style.left='100vw';
});


function updateCart() {
    c('.menu-openner span').innerHTML = cart.length;
    if(cart.length > 0) {
        c('aside').classList.add('show');
        c('.cart').innerHTML = ''; //limpo o carrinho - visual
        //Fechando valores
        let subtotal = 0;
        let desconto = 0;
        let total = 0;
        cart.map((itemCart, index)=>{
            let modelItem = modelsJson.find((itemBD)=>itemBD.id == itemCart.id);
            subtotal += modelItem.price [itemCart.size] * itemCart.qt;
            //console.log(modelItem);
            let cartItem = c('.models .cart--item').cloneNode(true);
            //Alternativa
             let modelSizeName;
            switch(itemCart.size) {
                case 0:
                    modelSizeName = 'Primeira Opção';
                    break;
                case 1:
                    modelSizeName = 'Segunda Opção';
                    break;
                case 2:
                    modelSizeName = 'Terceira Opção';
            }
            cartItem.querySelector('img').src = modelItem.img;
            //cartItem.querySelector('.cart--item-nome').innerHTML = `${modelItem.name} - ${modelItem.sizes[itemCart.size]}`;
            cartItem.querySelector('.cart--item-nome').innerHTML = `${modelItem.name} (${modelSizeName})`;
            cartItem.querySelector('.cart--item--qt').innerHTML = itemCart.qt;
            cartItem.querySelector('.cart--item-qtmenos').addEventListener('click',()=>{
                if(itemCart.qt > 1) {
                    itemCart.qt--
                } else {
                    cart.splice(index, 1);
                }
                updateCart();
            });
            cartItem.querySelector('.cart--item-qtmais').addEventListener('click',()=>{
                itemCart.qt++;
                updateCart();
            });
            c('.cart').append(cartItem);
        });
        desconto = subtotal * 0.1;
        total = subtotal - desconto;
        c('.subtotal span:last-child').innerHTML = `R$ ${subtotal.toFixed(2)}`;
        c('.desconto span:last-child').innerHTML = `R$ ${desconto.toFixed(2)}`;
        c('.total span:last-child').innerHTML = `R$ ${total.toFixed(2)}`;
    } else {
        c('aside').classList.remove('show');
        c('aside').style.left = '100vw';
    }
}