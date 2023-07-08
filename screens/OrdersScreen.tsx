import React, {useState} from 'react';
import {View, Text, FlatList} from 'react-native';
import {Card, Button, Modal, Portal, Provider} from 'react-native-paper';
import {useOrder} from '../hooks/useOrder';
import {StyleSheet} from 'react-native';

type Order = {
  id: number;
  customer_id: number;
  created_at: string;
  updated_at: string;
  customer: {
    id: number;
    name: string;
    username: string;
  };
  order_products: {
    id: number;
    product_id: number;
    order_id: number;
    quantity: number;
  }[];
  products: {
    id: number;
    name: string;
    stock: number;
    product_detail: {
      price: number;
      description: string;
      color: string;
    };
  }[];
};

export default function OrdersScreen() {
  const [visible, setVisible] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const {data: orders, isSuccess, isError, error, isLoading} = useOrder();

  const showModal = (order: Order) => {
    setSelectedOrder(order);
    setVisible(true);
  };

  const hideModal = () => setVisible(false);

  const renderItem = ({item}: {item: Order}) => (
    <Card style={styles.item} onPress={() => showModal(item)}>
      <Card.Title
        title={`Order ID: ${item.id}`}
        titleStyle={{color: 'black'}}
      />
      <Card.Content>
        <Text style={styles.title}>Customer ID: {item.customer_id}</Text>
      </Card.Content>
    </Card>
  );

  if (isLoading) {
    return <Text style={styles.text}>Loading...</Text>;
  }

  if (isError) {
    if (error instanceof Error) {
      return <Text style={styles.text}>Error: {error.message}</Text>;
    } else {
      return <Text style={styles.text}>An unknown error occurred.</Text>;
    }
  }

  return (
    <Provider>
      <View style={styles.container}>
        {isSuccess && (
          <FlatList
            data={orders}
            renderItem={renderItem}
            keyExtractor={item => item.id.toString()}
            contentContainerStyle={styles.flatlist}
          />
        )}
        <Portal>
          <Modal visible={visible} onDismiss={hideModal}>
            {selectedOrder && (
              <Card style={styles.modal_container}>
                <Card.Title
                  title={`Order ID: ${selectedOrder.id}`}
                  titleStyle={{color: 'black'}}
                />
                <Card.Content>
                  <Text style={styles.text}>
                    Customer ID: {selectedOrder.customer_id}
                  </Text>
                  {selectedOrder.products.map((product, index) => (
                    <View key={index}>
                      <Text style={styles.text}>Product: {product.name}</Text>
                      <Text style={styles.text}>
                        Quantity: {selectedOrder.order_products[index].quantity}
                      </Text>
                    </View>
                  ))}
                  {/* TODO: Place the add, delete, edit order buttons here based on the user role */}
                </Card.Content>
              </Card>
            )}
            <Button style={styles.button} onPress={hideModal}>
              Close
            </Button>
          </Modal>
        </Portal>
      </View>
    </Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#253d5b',
  },
  flatlist: {
    padding: 10,
    backgroundColor: '#253d5b',
  },
  item: {
    backgroundColor: '#C2ECFF',
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    padding: 10,
    borderRadius: 10,
  },
  modal_container: {
    backgroundColor: '#C2ECFF',
    borderColor: 'gray',
    borderWidth: 1,
    padding: 10,
    borderRadius: 10,
    margin: 20,
  },
  title: {
    fontSize: 32,
    color: '#253d5b',
  },
  text: {
    fontSize: 16,
    color: '#253d5b',
  },
  button: {
    marginVertical: 10,
    backgroundColor: '#8f95d3',
    color: '#C2ECFF',
    borderRadius: 10,
    margin: 20,
  },
});
