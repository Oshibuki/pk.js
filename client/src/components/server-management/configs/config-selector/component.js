import React from 'react';
import { Input } from 'reactstrap';

class Component extends React.Component{
  constructor(){
    super();
    this.onChange = this.onChange.bind(this);
  }

  onChange(event){
    if(typeof this.props.onChange === 'function')
      this.props.onChange(event.target.value);
  }

  render(){
    return (
      <Input
        type="select"
        className={this.props.className}
        value={this.props.selectedConfig || undefined}
        onChange={this.onChange}
        disabled={this.props.disabled}
      >
        <option className="text-default" value={null}>Select a Config...</option>
        {
          this.props.configs.map((config, key) => (
            <option
              className="text-default"
              value={config.name}
              key={key}
            >
              {config.name}
            </option>
          ))
        }
        {
          this.props.newConfig &&
          <option className="text-default" value={"new"}>Create New Config File...</option>
        }
      </Input>
    );
  }
}

export default Component;