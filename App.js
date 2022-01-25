import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ActivityIndicator, Keyboard } from "react-native";
import Picker from "./src/components/Picker";
import api from "./src/services/api";

export default function App(){

  const [moedas, setMoedas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [moedaSelecionada, setMoedaSelecionada] = useState(null)
  const [moedaDigitada, setMoedaDigitada] = useState(0)
  const [valorMoeda, setValorMoeda] = useState(null)
  const [valorConvertido, setValorConvertido] = useState(0)

  useEffect(()=>{
    async function loadMoedas(){
        const response = await api.get('all');
        
      let arrayMoedas = []

        Object.keys(response.data).map((key)=>{
          arrayMoedas.push({
            key:key,
            label: key,
            value: key
          })
        })

        setMoedas(arrayMoedas);
        setLoading(false);
    }

    loadMoedas();

  },[])

 async function converter(){
  if(moedaSelecionada==null || moedaDigitada === 0){
    alert("Digite um valor ou selecione uma moeda! ")
    return;
  }

  const response = await api.get(`all/${moedaSelecionada}-BRL`)
  //console.log(response.data[moedaSelecionada].ask)

  let resultado = response.data[moedaSelecionada].ask * parseFloat(moedaDigitada);
  setValorConvertido(`R$ ${resultado.toFixed(2)}`);
  setValorMoeda(moedaDigitada);
  Keyboard.dismiss();

 }


  if(loading){
    return(
      <View style={{justifyContent: 'center', alignItems: 'center', flex: 1}}>
        <ActivityIndicator color="#FFF" size={50} />
      </View>
    )
  }
  else{
    return(
      <View style={styles.container}>
          <View style={styles.containerMoeda}>
            <Text style={styles.textoMoeda}>Selecione uma moeda</Text>
            <Picker moedas={moedas} onChange={(moeda)=>{setMoedaSelecionada(moeda)}}/>
          </View>
          <View style={styles.containerValor}>
          <Text style={styles.textoMoeda}>Digite um valor em (R$)</Text>
          <TextInput 
          onChangeText={(valor) => setMoedaDigitada(valor)}
          keyboardType="numeric"
          style={styles.input}
          placeholder="Ex: 100"
          />
          </View>
  
        <TouchableOpacity style={styles.btnArea} onPress={converter}>
          <Text style={styles.textBtn}>Converter</Text>
        </TouchableOpacity>
  
  
        {valorConvertido !== 0 && (
          <View style={styles.areaResultado}>
          <Text style={styles.valorConvertido}>
            {valorMoeda} {moedaSelecionada}
          </Text>
          <Text style={[styles.valorConvertido, {fontSize: 20, margin: 10}]}>
            Corresponde à:
          </Text>
          
          <Text style={styles.valorConvertido}>
            {valorConvertido}
          </Text>

        </View>
        )}
  
      </View>
    )
  }

  
}

const styles = StyleSheet.create({
  container:{
    flex: 1,
    alignItems:'center',
    backgroundColor: '#101215',
    paddingTop: 40
  },
  containerMoeda:{
    width: '90%',
    backgroundColor: '#f9f9f9',
    paddingTop:10,
    borderTopLeftRadius: 9,
    borderTopRightRadius: 9,
    marginBottom: 2
  },
  textoMoeda:{
    color: '#000',
    fontSize: 17,
    paddingTop: 5,
    paddingLeft: 5
  },
  containerValor:{
    width: '90%',
    backgroundColor: '#f9f9f9',
    paddingBottom: 10,
    paddingTop: 10
  },
  input:{
    width: '100%',
    padding: 10,
    height: 45,
    fontSize: 20,
    marginTop: 8,
    color: '#000'
  },
  btnArea:{
    width: '90%',
    backgroundColor: '#fb4b57',
    height: 45, 
    marginTop: 1,
    borderBottomLeftRadius: 9,
    borderBottomRightRadius: 9,
    justifyContent: 'center',
    alignItems: 'center'
  },
  textBtn:{
    fontSize: 20,
    color: '#FFF',
    fontWeight: 'bold'
  },
  areaResultado:{
    width: '90%',
    backgroundColor: '#FFF',
    marginTop: 35,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 25
  },
  valorConvertido:{
    fontSize: 40,
    fontWeight: 'bold',
    color: '#000'
  }

})
 