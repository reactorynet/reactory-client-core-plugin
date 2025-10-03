
import '@babel/polyfill';
import { components } from './components';

const REACTORY_CORE_PLUGIN = (props) => {

}



REACTORY_CORE_PLUGIN.install = function( reactory: Reactory.Client.IReactoryApi){
  
  reactory.log("Installing Reactory Core Plugin");
  reactory.registerComponent('reactory-core', 'ReactoryCoreClientPlugin', '1.0.0', REACTORY_CORE_PLUGIN);
  
  components.forEach((component) => {
    reactory.log('Installing Component', { component }, 'debug');    
    reactory.registerComponent(component.nameSpace, component.name, component.version, component.component, component.tags, component.roles, true);        
  });
  // a comments
  reactory.amq.raiseReactoryPluginEvent('loaded', { componentFqn: 'reactory-core.ReactoryCoreClientPlugin@1.0.0', component: REACTORY_CORE_PLUGIN });
  reactory.log("Installing Reactory Core Plugin - Done");
};

if(window && window.reactory) {  
    REACTORY_CORE_PLUGIN.install(window.reactory.api);
};