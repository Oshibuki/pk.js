import { gql } from 'apollo-boost';

export default gql`
  query PlayerNames($serverID: Int!, $guid: String!){
    server(id: $serverID){
      _id
      
      player(guid: $guid){
        _id
        
        playerNames {
          _id
          name
          lastSeen
        }
      }
    }
  }
`;
