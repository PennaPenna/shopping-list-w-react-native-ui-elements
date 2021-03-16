import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, StatusBar, FlatList } from 'react-native';
import * as SQLite from 'expo-sqlite';
import { Header, Button, Input, ListItem } from 'react-native-elements';


export default function App() {
  const[item, setItem] = useState('');
  const[quant, setQuant] = useState('');
  const[list, setList] = useState([]);

  const db  = SQLite.openDatabase('listdb.db');

  useEffect(() => {
    db.transaction(tx  => {
      tx.executeSql('create table if not exists list (id integer primary key not null, item text, quant text);');
    },  null, updateList);
  }, []); 

  const saveItem = () => {
    db.transaction(tx => {
      tx .executeSql('insert into list (item, quant) values(?, ?);',
        [item, quant]);
    }, null, updateList
  )
}

  const deleteItem = (id) => {
      db.transaction(
        tx => { tx.executeSql('delete from list where id = ?;', [id]);}, null, updateList)
  }


const updateList = () => {
  db.transaction(tx => {
    tx.executeSql('select * from list;', 
    [], (_, { rows }) => 
      setList(rows._array)
      ); 
  });
  setItem('');
  setQuant('');
}

   return (
    <View style={styles.container}>
      <Header containerStyle={{ marginBottom:15 }} centerComponent={{ text:'SHOPPINGLIST', style:{ fontSize:14, fontWeight:'bold', color: '#ffffff' }}}/>
      <Input style={styles.input}
        value={item}
        placeholder="Product"
        onChangeText={(item) => setItem(item)}
      />
      <Input style={styles.input}
        value={quant}
        placeholder="Amount"
        onChangeText={(quant) => setQuant(quant)}
      />
     <View style={styles.button}>
       <Button raised 
        titleStyle={{ fontSize: 14 }}
        title="SAVE" 
        onPress={saveItem}/>
       </View>
       <View style={styles.listcontainer}>
  {
    list.map((l, i) => (
      <ListItem key={i} bottomDivider>
        <ListItem.Content>
          <ListItem.Title>{l.item}</ListItem.Title>
          <ListItem.Subtitle>{l.quant}</ListItem.Subtitle>
        </ListItem.Content>
        <Button type="clear" 
                titleStyle={{fontSize: 10, color:'#bababa'}}
                icon={{ type:"material", name: "done", size: 20, color:'#bababa' }} 
                title="bought" iconDone 
                onPress={()  =>  deleteItem(l.id)  }/>
      </ListItem>
    ))
  }
</View>
     <StatusBar style="auto" />
    </View>
  );
};

const styles = StyleSheet.create({
 container: {
  flex: 1,
  alignItems: 'center',
  width:'100%',
 },
 input: {
  fontSize: 14, 
  padding:5, 
  marginTop:10,
 }, 
 button: {
 width: '60%',
 margin:10,
 },
 listcontainer: { 
  width:'100%',
  marginTop:5,
},
});
