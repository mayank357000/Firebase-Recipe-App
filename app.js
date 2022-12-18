//firebase is a backend as a service
//nos ql database have collections
//collections[inside database] have document[of key value pairs]
//and document have javascript oobjects or key value [pairs]
//we will make our new project/databse in test mode
//so no firebase auth rules for now
const list=document.querySelector('ul');
const form=document.querySelector('form');
const unsubButton=document.querySelector('button');

const addRecipe=(recipe,id)=>{
   let time=recipe.created_at.toDate();//proto se dekha
   let html=`
   <li data-id="${id}">
     <div>${recipe.title}</div>
     <div>${time}</div>
     <button class="btn btn-danger btn-sm my-2">delete</button>
   </li>
   `
   list.innerHTML+=html;
}


// db.collection('recipes')//return promise after callng use used then
//    .get()
//    .then((snapshot) => {
//     //   console.log(snapshot.docs[0].data());
//     snapshot.docs.forEach(doc => {
//         // console.log(doc.data());
//         createRecipe(doc.data(),doc.id);
//     }); 
// })
//    .catch((err) => {
//       console.log(err);
// });


const deleteRecipe=(id)=>{
    const recipes=document.querySelectorAll('li');
    recipes.forEach(recipe=>{
        if(recipe.getAttribute('data-id')===id)
        {
            console.log('recipe removed from dom');
            recipe.remove();
        }
    });
}

//firebase gives a realtime listener in js so that get notified when changes in collection happen
//we use this and jab bhi change ho then we will either add or delete item in dom from li list
//will give us realtime functionality and no refresh needed
// db.collection('recipes').onSnapshot(snapshot=>{
//     //initially sab ele ka change 'added' hoga jb first time access
//     //so can add all items jo bhi db mai hai
//     snapshot.docChanges().forEach(change=>{
//         const doc=change.doc;
//         if(change.type==='added'){
//             addRecipe(doc.data(),doc.id);
//         }else if(change.type==='removed')
//         {
//           deleteRecipe(doc.id);//ye method bs dom ko update ke liye
//           //eventlistener neeche se pehle hi db se delete
//         }
//     })
// })



//now ab ye realtime listener band krna ho ek time pr
//mtlb ki ab UI iske thorugh change nhi kr paenge
//still apna neeche ka delete listener would delete from db
//but our UI won't change 
//and add bhi hoga magr sirf db mai UI won't change
//ye realtime listerner returns us a function
//jo ye listener band kr skta hai
const unsub=db.collection('recipes').onSnapshot(snapshot=>{
    //initially sab ele ka change 'added' hoga jb first time access
    //so can add all items jo bhi db mai hai
    snapshot.docChanges().forEach(change=>{
        const doc=change.doc;
        if(change.type==='added'){
            addRecipe(doc.data(),doc.id);
        }else if(change.type==='removed')
        {
          deleteRecipe(doc.id);//ye method bs dom ko update ke liye
          //eventlistener neeche se pehle hi db se delete
        }
    });
});

unsubButton.addEventListener('click',(e)=>{
    unsub();
    console.log('listenr band and ab no UI change through it');
})



//add object to firebase 
form.addEventListener('submit',e=>{
    e.preventDefault();

    const now=new Date();
    const recipe={
        title: form.recipe.value,
        created_at: firebase.firestore.Timestamp.fromDate(now)
        //firebase obj mila script tag from friebase app.js
    };

    db.collection('recipes').add(recipe).then(()=>{
        console.log('recipe added');
    }).catch((err)=>{
        console.log(err);
    })
    form.reset();
})


//delete obj
//evern delegation ki poori list pr eventlis
//phit dekhna kya wo button tha kya
//delete toh ho jaega mgr jab tk page refreh nhi
//wo db.coll wala first method run nhi hoga
//so no real time cheez 
list.addEventListener('click',e=>{
    if(e.target.tagName==='BUTTON')
    {
        const id=e.target.parentElement.getAttribute('data-id');
        db.collection('recipes').doc(id).delete().then(()=>{
            console.log('recipe deleted from database');
        });
    }
});