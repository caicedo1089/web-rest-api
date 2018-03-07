(
	function()
	{
		//Creamos el Sonic Loader
		var sonicLoader = new Sonic({
 
			width: 50,
			height: 50,
			padding: 50,
		 
			strokeColor: '#000',
		 
			pointDistance: .01,
			stepsPerFrame: 3,
			trailLength: .7,
		 
			step: 'fader',
		 
			setup: function() {
				this._.lineWidth = 5;
			},
		 
			path: [
				['arc', 25, 25, 25, 0, 360]
			]
		 
		});
		 
		sonicLoader.play();
		
		//Verificamos que este ejecutando GoogleChrome
		if( navigator && 
			navigator['vendor'] != undefined && 
			navigator['vendor'] != 'Google Inc.' )
		{
			alert('No se soporta ese Browser, por favor ejecutar en Google Chrome');
			return;
		}
		
		//Seteamos los path
		Ext.Loader.setConfig(
			{
				enabled: true,
				paths: {
					Ext: 'js/ext4.2.1/src',
				}
			}
		);

		//Precargamos los librerías
		Ext.require([
			'Ext.grid.*',
			'Ext.data.*',
			'Ext.panel.*'
		]);
		
		//Cargamos la aplicación
		Ext.onReady(
			function()
			{
				//Agregamos el Sonic Loader
				var container = document.getElementsByClassName('content');
				container = container[0] || null;
				
				if(container != null)
				{
					var title = document.getElementsByClassName('title');   // Get the <ul> element with id="myList"
					container.removeChild(title[0] || null);  
					container.appendChild(sonicLoader.canvas);
				}
			}
		);
	
		var storeUsers = new Ext.data.JsonStore({
			storeId: 'idStoreUsers',
			//autoLoad: true,
			//remoteSort : true,
			proxy: {
				type: 'ajax',
				url: `${PURL}users/`,
				reader: {
					type: 'json',
					root: 'data',
					idProperty: 'id',
					totalProperty: 'total'
				},
			},
			sorters    : [
				{
					property  : 'id',
					direction : 'DESC'
				}
			],
			fields: [
				'id',
				'full_name',
				'username', 
				'email',
				{
					name:'created_at',
					type: 'date'
				},
				{
					name:'updated_at',
					type: 'date'
				},
				{
					name:'deleted_at',
					type: 'date'
				}  
			]
		});
				
		
		Ext.application({
			requires: [
				'Ext.container.Viewport'
			],
			name: 'AppExt',
			controllers: [],
			views: [],
			appFolder: '/',
			launch: function ()
			{
				//Habilitar Cors 
				Ext.Ajax.useDefaultXhrHeader = false;
				Ext.Ajax.cors = true;
                
                var windowRegister = null, windowLogin = null

				//Desplegamos la aplicación
				var principalWindow = Ext.create('Ext.container.Viewport', {
					layout: 'fit',
					counterId: 0,
					items: [
						{
							layout: {
								type: 'border'
							},
							items: [
								{
									region: 'center',
									xtype: 'panel',
									layout: 'fit',
									border: false,
									width: '100%',
									autoHeight: true,
									items: [
										{
											xtype: 'grid',
											id: 'idGridUsers',
											title: 'Usuarios',
											store: storeUsers,
											selType: 'checkboxmodel' ,
											columns: [
                                                { 
													width: 50,
													text: 'ID',  
                                                    dataIndex: 'id',
                                                    hidden: true
												},
												{ 
													flex: 1,
													text: 'Nombre Completo',  
													dataIndex: 'full_name' 
												},
												{ 
													flex: 1,
													text: 'Username',  
													dataIndex: 'username' 
												},
												{ 
													flex: 1,
													text: 'Correo Eléctronico',  
													dataIndex: 'email' 
												},
												{
													flex: 1,
													text:'Creaci&oacute;n',
													xtype: 'datecolumn',
													dataIndex: 'created_at',
													renderer: function(value, metaData, record, rowIndex , colIndex , store , view, returnHtml)
													{
														return Ext.Date.format(record.get('created_at'), 'd-m-Y H:i:s')
													},
												},
												{
													flex: 1,
													text:'Actualizaci&oacute;n',
													xtype: 'datecolumn',
													dataIndex: 'updated_at',
													renderer: function(value, metaData, record, rowIndex , colIndex , store , view, returnHtml)
													{
														return Ext.Date.format(record.get('updated_at'), 'd-m-Y H:i:s')
													},
												}
											],
											dockedItems: [
												{
													xtype: 'pagingtoolbar',
													store: storeUsers,
													dock: 'bottom',
													displayInfo: true
												}
											],
										}
									]
								},
								//Menú
								{
									xtype: 'toolbar',
									region: 'north',
									ui: 'footer',
									height: 40,
									items: [
										{
											xtype: 'label',
											html: [
												'<p style="font-size: 18px;font-weight: bold; padding: 0;margin: 5px 10px;">',
													'CRUD Usuarios',
												'</p>',
											].join('')
										},
                                        '->',
                                        {
                                            labelWidth: 40,
                                            xtype: 'textfield',
                                            fieldLabel: 'Buscar',
                                            id: 'idSearch',
                                            listeners:{
                                                change: function(thisField, newValue, oldValue, eOpts)
                                                {
                                                    
                                                    storeUsers.proxy.extraParams = {
                                                        filter: newValue
                                                    }

                                                    Ext.Ajax.abort(storeUsers.lastRequest);

                                                    storeUsers.loadPage(1)   
                                                }
                                            }
                                        },
                                        '-',
										{
											text: 'Crear',
											listeners:
											{
												click: function(thisButton, e, eOpts)
												{
													let windowCrear = Ext.create('Ext.window.Window', {
                                                        title: 'Crear Usuario',
                                                        modal: true,
                                                        draggable: false,
                                                        closable: false,
                                                        height: 200,
                                                        width: 300,
                                                        layout: 'fit',
                                                        closeAction: 'destroy',
                                                        items:[
                                                            {
                                                                xtype: 'form',
                                                                bodyPadding: 5,
                                                                layout: 'anchor',
                                                                defaults: {
                                                                    anchor: '100%'
                                                                },
                                                                defaultType: 'textfield',
                                                                items: [
                                                                    {
                                                                        fieldLabel: 'Nombre Completo',
                                                                        name: 'full_name',
                                                                        allowBlank: false
                                                                    },
                                                                    {
                                                                        fieldLabel: 'Username',
                                                                        name: 'username',
                                                                        allowBlank: false
                                                                    },
                                                                    {
                                                                        fieldLabel: 'Correo Eléctrónico',
                                                                        name: 'email',
                                                                        allowBlank: false
                                                                    },
                                                                    {
                                                                        fieldLabel: 'Contraseña',
                                                                        name: 'password',
                                                                        inputType: 'password',
                                                                        allowBlank: false
                                                                    }
                                                                ],
                                                                buttons: [
                                                                    {
                                                                        text: 'reset',
                                                                        handler: function(thisButton, eEvent)
                                                                        {
                                                                            let formRegister = this.up('form').getForm()
                                                                            formRegister.reset();
                                                                        }
                                                                    },
                                                                    {
                                                                        text: 'Cancelar',
                                                                        handler: function(thisButton, eEvent)
                                                                        {
                                                                            windowCrear.hide()
                                                                        }
                                                                    }, 
                                                                    {
                                                                        text: 'Crear',
                                                                        formBind: true,
                                                                        disabled: true,
                                                                        handler: function(thisButton, eEvent)
                                                                        {
                                                                            var form = this.up('form').getForm();
                                                                            
                                                                            if (form.isValid())
                                                                            {
                                                                                var formData = form.getValues();
                                    
                                                                                windowCrear.getEl().mask();
                                                                                storeUsers.loadPage(1);

                                                                                //Hacemos la llamada AJAX
                                                                                Ext.Ajax.request({
                                                                                    url      : `${PURL}users/`,
                                                                                    dataType : 'json',
                                                                                    method   : 'POST',
                                                                                    headers  : {
                                                                                        'Content-Type': 'application/json'
                                                                                    },
                                                                                    jsonData: formData,
                                                                                    success  : function(response)
                                                                                    {
                                                                                        var objResp = Ext.decode(response.responseText);
                                    
                                                                                        windowCrear.hide();
                                                                                        storeUsers.loadPage(1);

                                                                                        Ext.Msg.show({
                                                                                            title:'Usuario',
                                                                                            msg: `Usuario creado con éxito`,
                                                                                            icon: Ext.MessageBox.INFO,
                                                                                            buttons: Ext.Msg.OK,
                                                                                        });
                                                                                    },
                                                                                    failure  : function(response)
                                                                                    {
                                                                                        var objResp = Ext.decode(response.responseText);
                                    
                                                                                        windowRegister.getEl().unmask();
                                    
                                                                                        Ext.Msg.show({
                                                                                            title:'ERROR',
                                                                                            msg: objResp['error'],
                                                                                            icon: Ext.MessageBox.ERROR,
                                                                                            buttons: Ext.Msg.OK,
                                                                                        });
                                                                                    }
                                                                                });
                                                                            }
                                                                        }
                                                                    }
                                                                ],
                                                            }
                                                        ]
                                                    }).show()
												}
											}
										},
										{
											text: 'Editar',
											listeners:
											{
												click: function(thisButton, e, eOpts)
												{
													var gridUsers = Ext.getCmp('idGridUsers');
													var records = gridUsers.getSelectionModel().getSelection();

													if(records.length != 1)
													{
														Ext.Msg.show({
															title:'ERROR',
															msg: 'Debe seleccionar un solo registro.',
															icon: Ext.MessageBox.ERROR,
															buttons: Ext.Msg.OK,
														});
														return;
													}

													var windowForm = Ext.create('Ext.window.Window', {
                                                        title: 'Editar Usuario',
                                                        modal: true,
                                                        draggable: false,
                                                        closable: false,
                                                        height: 200,
                                                        width: 300,
                                                        layout: 'fit',
                                                        closeAction: 'destroy',
                                                        items:[
                                                            {
                                                                xtype: 'form',
                                                                bodyPadding: 5,
                                                                layout: 'anchor',
                                                                defaults: {
                                                                    anchor: '100%'
                                                                },
                                                                defaultType: 'textfield',
                                                                items: [
                                                                    {
                                                                        xtype:'hiddenfield',
                                                                        name: 'id'
                                                                    },
                                                                    {
                                                                        fieldLabel: 'Nombre Completo',
                                                                        name: 'full_name',
                                                                        allowBlank: false
                                                                    },
                                                                    {
                                                                        fieldLabel: 'Username',
                                                                        name: 'username',
                                                                        allowBlank: false
                                                                    },
                                                                    {
                                                                        fieldLabel: 'Correo Eléctrónico',
                                                                        name: 'email',
                                                                        allowBlank: false
                                                                    },
                                                                    {
                                                                        fieldLabel: 'Contraseña',
                                                                        name: 'password',
                                                                        inputType: 'password',
                                                                        allowBlank: false
                                                                    }
                                                                ],
                                                                buttons: [
                                                                    {
                                                                        text: 'Cancelar',
                                                                        handler: function(thisButton, eEvent)
                                                                        {
                                                                            windowForm.hide()
                                                                        }
                                                                    }, 
                                                                    {
                                                                        text: 'Editar',
                                                                        formBind: true,
                                                                        disabled: true,
                                                                        handler: function(thisButton, eEvent)
                                                                        {
                                                                            var form = this.up('form').getForm();
                                                                            
                                                                            if (form.isValid())
                                                                            {
                                                                                var formData = form.getValues();

                                                                                let id = formData['id']
                                                                                delete formData['id']
                                    
                                                                                windowForm.getEl().mask();
                                                                                //Hacemos la llamada AJAX
                                                                                Ext.Ajax.request({
                                                                                    url      : `${PURL}users/${id}`,
                                                                                    dataType : 'json',
                                                                                    method   : 'PUT',
                                                                                    headers  : {
                                                                                        'Content-Type': 'application/json'
                                                                                    },
                                                                                    jsonData: formData,
                                                                                    success  : function(response)
                                                                                    {
                                                                                        var objResp = Ext.decode(response.responseText);
                                    
                                                                                        windowForm.hide();
                                                                                        
                                                                                        storeUsers.loadPage(1);
                                                                                        
                                                                                        Ext.Msg.show({
                                                                                            title: 'Usuario',
                                                                                            msg: `Usuario actualizado con éxito`,
                                                                                            icon: Ext.MessageBox.INFO,
                                                                                            buttons: Ext.Msg.OK,
                                                                                        });
                                                                                    },
                                                                                    failure  : function(response)
                                                                                    {
                                                                                        var objResp = Ext.decode(response.responseText);
                                    
                                                                                        windowRegister.getEl().unmask();
                                    
                                                                                        Ext.Msg.show({
                                                                                            title:'ERROR',
                                                                                            msg: objResp['error'],
                                                                                            icon: Ext.MessageBox.ERROR,
                                                                                            buttons: Ext.Msg.OK,
                                                                                        });
                                                                                    }
                                                                                });
                                                                            }
                                                                        }
                                                                    }
                                                                ],
                                                            }
                                                        ]
                                                    });
													windowForm.show();
													
													windowForm.down('form').getForm().setValues(
														records[0]['raw']
													);
												}
											}
										},
										{
											text: 'Eliminar',
											listeners:
											{
												click: function(thisButton, e, eOpts)
												{
													var gridUsers = Ext.getCmp('idGridUsers');
													var records = gridUsers.getSelectionModel().getSelection();

													if(records.length != 1)
													{
														Ext.Msg.show({
															title:'ERROR',
															msg: 'Debe seleccionar un solo registro.',
															icon: Ext.MessageBox.ERROR,
															buttons: Ext.Msg.OK,
														});
														return;
													}

													var id = records[0]['raw']['id'];

													Ext.Msg.show({
														title:'Eliminando',
														msg:'¿Desea eliminar el registro seleccionado?',
														buttons:Ext.Msg.YESNO,
														callback:function(btn) 
														{
															if('yes' === btn)
															{
																principalWindow.getEl().mask();
																//Hacemos la llamada AJAX
																Ext.Ajax.request({
																	url      : `${PURL}users/${id}`,
																	dataType : 'json',
																	method   : 'DELETE',
																	success  : function(response)
																	{
																		var objResp = Ext.decode(response.responseText);

																		principalWindow.getEl().unmask();
																		storeUsers.loadPage(1);
																		
																		Ext.Msg.show({
																			title:'Usuario Eliminado',
																			msg: objResp['msg'],
																			icon: Ext.MessageBox.INFO,
																			buttons: Ext.Msg.OK,
																		});
																	},
																	failure  : function(response)
																	{
																		var objResp = Ext.decode(response.responseText);

																		principalWindow.getEl().unmask();

																		Ext.Msg.show({
																			title:'ERROR',
																			msg: objResp['msg'],
																			icon: Ext.MessageBox.ERROR,
																			buttons: Ext.Msg.OK,
																		});
																	}
																});
															}
														}
													});
													var form = Ext.getCmp('idFormRequest').getForm();

													form.reset();
												}
											}
                                        },
                                        '-',
                                        {
                                            id: 'idUserName',
                                            xtype: 'label',
                                            text: 'Nombre Usuario'
                                        },
                                        {
                                            text:'Salir',
                                            listeners:
                                            {
                                                click:function(thisButton, e, eOpts)
                                                {
                                                    principalWindow.getEl().mask();

                                                    //Hacemos la llamada AJAX
                                                    Ext.Ajax.request({
                                                        url      : `${PURL}auth/logout`,
                                                        method   : 'GET',
                                                        success  : function(response)
                                                        {
                                                            var objResp = Ext.decode(response.responseText);
                                                            
                                                            principalWindow.getEl().unmask();

                                                            localStorage.clear()
                                                            storeUsers.removeAll();
                                                           
                                                            Ext.getCmp('idUserName').setText('Nombre usuario')

                                                            windowLogin.show();
                                                        },
                                                        failure  : function(response)
                                                        {
                                                            var objResp = Ext.decode(response.responseText);

                                                            principalWindow.getEl().unmask();

                                                            Ext.Msg.show({
                                                                title:'ERROR',
                                                                msg: objResp['error'],
                                                                icon: Ext.MessageBox.ERROR,
                                                                buttons: Ext.Msg.OK,
                                                            });
                                                        }
                                                    });
                                                }
                                            }
                                        }
									]
								},
								//Footer
								{
									region: 'south',
									xtype: 'label',
									padding: '5 10',
									html: [
										'<div style="padding: 5 10;">',
											'<div style="float:left;">',
												'Version ' + PVersion,
											'</div>',
											'<div style="float:right;">',
												'Desarrollado por ',
												'<a href="http://pcaicedo.com" target="_black" style="text-decoration: none;">',
													'Pedro Caicedo',
												'</a>',
											'</div>',
										'</div>',
									].join(''),
								},
							]
						}
					],
					listeners:{
						beforerender: function ( thisViewport, eOpts )
						{
							var container = document.getElementsByClassName('container');
							document.body.removeChild(container[0] || null);  
						}
					}
				});

                //Verificamos que tenga acceso a los datos
                windowRegister = null;
                windowLogin = Ext.create('Ext.window.Window', {
                    title: 'Autenticación',
                    modal: true,
                    draggable: false,
                    closable: false,
                    closeAction: 'hide',
                    height: 150,
                    width: 300,
                    layout: 'fit',
                    items:[
                        {
                            xtype: 'form',
                            bodyPadding: 5,
                            layout: 'anchor',
                            defaults: {
                                anchor: '100%'
                            },
                            defaultType: 'textfield',
                            items: [
                                {
                                    fieldLabel: 'Correo Eléctrónico',
                                    name: 'login',
                                    allowBlank: false
                                },
                                {
                                    fieldLabel: 'Contraseña',
                                    name: 'password',
                                    inputType: 'password',
                                    allowBlank: false
                                }
                            ],
                            buttons: [
                                {
                                    text: 'Registrarme',
                                    handler: function(thisButton, eEvent)
                                    {
                                        let formLogin = this.up('form')
                                        formLogin.getForm().reset();

                                        windowLogin.hide();
                                        windowRegister.show();
                                    }
                                }, 
                                {
                                    text: 'Loguiarme',
                                    formBind: true,
                                    disabled: true,
                                    handler: function(thisButton, eEvent)
                                    {
                                        var form = this.up('form').getForm();
                                        
                                        if (form.isValid())
                                        {
                                            var formData = form.getValues();

                                            windowLogin.getEl().mask();

                                            //Hacemos la llamada AJAX
                                            Ext.Ajax.request({
                                                url      : `${PURL}auth/login`,
                                                dataType : 'json',
                                                method   : 'POST',
                                                headers  : {
                                                    'Content-Type': 'application/json'
                                                },
                                                jsonData: formData,
                                                success  : function(response)
                                                {
                                                    var objResp = Ext.decode(response.responseText);

                                                    windowLogin.getEl().unmask();
                                                    windowLogin.hide();
                                                    storeUsers.load();
                                                    localStorage.user = response.responseText;
                                                    nameUser(objResp.data)
                                                },
                                                failure  : function(response)
                                                {
                                                    var objResp = Ext.decode(response.responseText);

                                                    windowLogin.getEl().unmask();

                                                    Ext.Msg.show({
                                                        title:'ERROR',
                                                        msg: objResp['error'],
                                                        icon: Ext.MessageBox.ERROR,
                                                        buttons: Ext.Msg.OK,
                                                    });
                                                }
                                            });
                                        }
                                    }
                                }
                            ],
                        }
                    ],
                    listeners:{
                        beforehide: function( thisWindow, eOpts )
                        {
                            thisWindow.down('form').getForm().reset()
                        }
                    }
                })
                windowRegister = Ext.create('Ext.window.Window', {
                    title: 'Registro',
                    modal: true,
                    draggable: false,
                    closable: false,
                    height: 200,
                    width: 300,
                    layout: 'fit',
                    closeAction: 'hide',
                    items:[
                        {
                            xtype: 'form',
                            bodyPadding: 5,
                            layout: 'anchor',
                            defaults: {
                                anchor: '100%'
                            },
                            defaultType: 'textfield',
                            items: [
                                {
                                    fieldLabel: 'Nombre Completo',
                                    name: 'full_name',
                                    allowBlank: false
                                },
                                {
                                    fieldLabel: 'Username',
                                    name: 'username',
                                    allowBlank: false
                                },
                                {
                                    fieldLabel: 'Correo Eléctrónico',
                                    name: 'email',
                                    allowBlank: false
                                },
                                {
                                    fieldLabel: 'Contraseña',
                                    name: 'password',
                                    inputType: 'password',
                                    allowBlank: false
                                }
                            ],
                            buttons: [
                                {
                                    text: 'Regresar',
                                    handler: function(thisButton, eEvent)
                                    {
                                        let formRegister = this.up('form').getForm()
                                        formRegister.reset();
                                        
                                        windowRegister.hide()
                                        windowLogin.show()
                                    }
                                }, 
                                {
                                    text: 'Registrarme',
                                    formBind: true,
                                    disabled: true,
                                    handler: function(thisButton, eEvent)
                                    {
                                        var form = this.up('form').getForm();
                                        
                                        if (form.isValid())
                                        {
                                            var formData = form.getValues();

                                            windowRegister.getEl().mask();
                                            //Hacemos la llamada AJAX
                                            Ext.Ajax.request({
                                                url      : `${PURL}auth/register`,
                                                dataType : 'json',
                                                method   : 'POST',
                                                headers  : {
                                                    'Content-Type': 'application/json'
                                                },
                                                jsonData: formData,
                                                success  : function(response)
                                                {
                                                    var objResp = Ext.decode(response.responseText);

                                                    windowRegister.getEl().unmask();
                                                    windowRegister.hide();
                                                    windowLogin.show()

                                                    Ext.Msg.show({
                                                        title:'Usuario',
                                                        msg: `Usuario creado, por favor autentiquese`,
                                                        icon: Ext.MessageBox.INFO,
                                                        buttons: Ext.Msg.OK,
                                                    });
                                                },
                                                failure  : function(response)
                                                {
                                                    var objResp = Ext.decode(response.responseText);

                                                    windowRegister.getEl().unmask();

                                                    Ext.Msg.show({
                                                        title:'ERROR',
                                                        msg: objResp['error'],
                                                        icon: Ext.MessageBox.ERROR,
                                                        buttons: Ext.Msg.OK,
                                                    });
                                                }
                                            });
                                        }
                                    }
                                }
                            ],
                        }
                    ],
                    listeners:{
                        beforehide: function( thisWindow, eOpts )
                        {
                            thisWindow.down('form').getForm().reset()
                        }
                    }
                })
                
                var userData = Ext.JSON.decode(localStorage.user || '{}')

                if(!localStorage.user)
                {
                    windowLogin.show();
                }
                else
                {
                    nameUser(userData.data)

                    storeUsers.load();
                }
                
			}
        });
        
        function nameUser(userData)
        {
            Ext.getCmp('idUserName').setText(`Hola ${userData.full_name}`);
        }
	}
).call(this);